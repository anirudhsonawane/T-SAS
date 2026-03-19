import { createHmac, randomUUID } from "node:crypto";
import QRCode from "qrcode";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";
import { sendTicketEmail } from "@/app/lib/ticketEmail";
import { eventInfo } from "@/app/components/home/content";

export const runtime = "nodejs";

type VerifyPaymentBody = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  ticketType: string;
  quantity: number;
  eventId: string;
  eventName: string;
  amount: number;
  userEmail?: string;
  attendeeFirstName: string;
  attendeeLastName: string;
  attendeeMobile: string;
  attendeeEmail: string;
};

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function sendTicketEmailWithRetry(args: Parameters<typeof sendTicketEmail>[0]) {
  const attempts = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await sendTicketEmail(args);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await sleep(400 * attempt * attempt);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to send email");
}

function readTrimmedString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

function fireAndForget(task: Promise<unknown>) {
  task.catch((error) => {
    console.warn("Background task failed", error);
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Payment verification is not configured." }, { status: 500 });
  }

  let body: VerifyPaymentBody;
  try {
    body = (await request.json()) as VerifyPaymentBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    ticketType,
    quantity,
    eventId,
    eventName,
    amount,
    userEmail,
    attendeeFirstName,
    attendeeLastName,
    attendeeMobile,
    attendeeEmail,
  } = body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing Razorpay payload" }, { status: 400 });
  }

  const normalizedFirstName = attendeeFirstName?.trim() ?? "";
  const normalizedLastName = attendeeLastName?.trim() ?? "";
  const normalizedMobile = attendeeMobile?.replace(/\s+/g, "") ?? "";
  const normalizedAttendeeEmail = attendeeEmail?.trim().toLowerCase() ?? "";

  if (!normalizedFirstName || !normalizedLastName || !normalizedMobile || !normalizedAttendeeEmail) {
    return NextResponse.json({ error: "Missing booking details" }, { status: 400 });
  }
  if (!/^\+?[0-9]{8,15}$/.test(normalizedMobile)) {
    return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedAttendeeEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const generatedSignature = createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid Razorpay signature" }, { status: 400 });
  }

  try {
    const db = await getDb();

    const existingTicket = await db
      .collection("tickets")
      .findOne({ paymentId: razorpay_payment_id });

    if (existingTicket) {
      const existing = existingTicket as Record<string, unknown>;
      const knownTicketId = readTrimmedString(existing, "ticketId") || null;
      const emailTo =
        readTrimmedString(existing, "userEmail") ||
        readTrimmedString(existing, "attendeeEmail") ||
        normalizedAttendeeEmail ||
        null;

      let emailDelivery: { status: "sent" | "skipped" | "failed"; reason: string | null } = {
        status: "skipped",
        reason: null,
      };

      const alreadySent =
        knownTicketId &&
        (await db.collection("email_deliveries").findOne({ ticketId: knownTicketId, status: "sent" }));

      if (alreadySent) {
        emailDelivery = { status: "sent", reason: null };
      } else if (emailTo && knownTicketId) {
        const deliveryId = randomUUID();
        emailDelivery = { status: "skipped", reason: "queued" };
        fireAndForget(
          (async () => {
            const createdAt = new Date().toISOString();
            try {
              await db.collection("email_deliveries").insertOne({
                deliveryId,
                ticketId: knownTicketId,
                userName: readTrimmedString(existing, "attendeeName") || null,
                email: emailTo,
                status: "queued",
                sent: false,
                reason: null,
                messageId: null,
                createdAt,
                updatedAt: createdAt,
              });
            } catch {
              // Ignore logging errors.
            }

            let emailStatus: "sent" | "skipped" | "failed" = "skipped";
            let emailReason: string | null = null;
            let emailMessageId: string | null = null;
            try {
              const result = await sendTicketEmailWithRetry({
                to: emailTo,
                ticketId: knownTicketId,
                name: readTrimmedString(existing, "attendeeName") || null,
                eventName: readTrimmedString(existing, "eventName") || eventName,
                eventDate: readTrimmedString(existing, "eventDate") || null,
                eventTime: readTrimmedString(existing, "eventTime") || null,
                venue: readTrimmedString(existing, "eventLocation") || null,
                ticketType: readTrimmedString(existing, "ticketType") || ticketType,
                seat: null,
                quantity: typeof existing.quantity === "number" ? existing.quantity : quantity,
                amount: typeof existing.amount === "number" ? existing.amount : amount,
                purchaseDate: readTrimmedString(existing, "purchaseDate") || new Date().toISOString(),
                qrCodeDataUrl: readTrimmedString(existing, "qrCode") || null,
              });

              if (result.ok) {
                emailStatus = "sent";
                emailMessageId = result.messageId ?? null;
              } else {
                emailStatus = "skipped";
                emailReason = "reason" in result ? result.reason : null;
              }
            } catch (error) {
              emailStatus = "failed";
              emailReason = error instanceof Error ? error.message : "Unknown email error";
            }

            if (emailStatus !== "sent") {
              console.warn("Ticket email not sent", { ticketId: knownTicketId, status: emailStatus, reason: emailReason });
            }

            try {
              await db.collection("email_deliveries").updateOne(
                { deliveryId },
                {
                  $set: {
                    status: emailStatus,
                    sent: emailStatus === "sent",
                    reason: emailReason,
                    messageId: emailMessageId,
                    updatedAt: new Date().toISOString(),
                  },
                },
              );
            } catch {
              // Ignore logging errors.
            }
          })(),
        );
      }

      return NextResponse.json({ ticket: existingTicket, emailDelivery });
    }

    const ticketId = randomUUID();
    const normalizedUserEmail = userEmail?.trim().toLowerCase() || normalizedAttendeeEmail || null;

    const infoMap = new Map(eventInfo.map((item) => [item.label.toLowerCase(), item.value]));
    const eventDate = infoMap.get("date") || "";
    const eventTime = infoMap.get("time") || "";
    const eventLocation = infoMap.get("location") || "";

    const ticketRecord = {
      ticketId,
      userEmail: normalizedUserEmail,
      attendeeFirstName: normalizedFirstName,
      attendeeLastName: normalizedLastName,
      attendeeName: `${normalizedFirstName} ${normalizedLastName}`.trim(),
      attendeeMobile: normalizedMobile,
      attendeeEmail: normalizedAttendeeEmail,
      eventId,
      eventName,
      eventDate,
      eventTime,
      eventLocation,
      ticketType,
      quantity,
      paymentId: razorpay_payment_id,
      paymentStatus: "paid",
      amount,
      purchaseDate: new Date().toISOString(),
    };
    const qrCodeData = await QRCode.toDataURL(`ticket:${ticketId}`);
    const ticketWithQr = { ...ticketRecord, qrCode: qrCodeData };
    await db.collection("tickets").insertOne(ticketWithQr);

    const emailTo = normalizedUserEmail ?? normalizedAttendeeEmail;
    const deliveryId = randomUUID();
    const queuedAt = new Date().toISOString();

    try {
      await db.collection("email_deliveries").insertOne({
        deliveryId,
        ticketId,
        userName: ticketRecord.attendeeName,
        email: emailTo,
        status: "queued",
        sent: false,
        reason: null,
        messageId: null,
        createdAt: queuedAt,
        updatedAt: queuedAt,
      });
    } catch {
      // Ignore logging errors.
    }

    fireAndForget(
      (async () => {
        let emailStatus: "sent" | "skipped" | "failed" = "skipped";
        let emailReason: string | null = null;
        let emailMessageId: string | null = null;

        try {
          const result = await sendTicketEmailWithRetry({
            to: emailTo,
            ticketId,
            name: ticketRecord.attendeeName,
            eventName,
            eventDate,
            eventTime,
            venue: eventLocation,
            ticketType,
            seat: null,
            quantity,
            amount,
            purchaseDate: ticketRecord.purchaseDate,
            qrCodeDataUrl: qrCodeData,
          });

          if (result.ok) {
            emailStatus = "sent";
            emailMessageId = result.messageId ?? null;
          } else {
            emailStatus = "skipped";
            emailReason = "reason" in result ? result.reason : null;
          }
        } catch (error) {
          emailStatus = "failed";
          emailReason = error instanceof Error ? error.message : "Unknown email error";
        }

        if (emailStatus !== "sent") {
          console.warn("Ticket email not sent", { ticketId, status: emailStatus, reason: emailReason });
        }

        try {
          await db.collection("email_deliveries").updateOne(
            { deliveryId },
            {
              $set: {
                status: emailStatus,
                sent: emailStatus === "sent",
                reason: emailReason,
                messageId: emailMessageId,
                updatedAt: new Date().toISOString(),
              },
            },
          );
        } catch {
          // Ignore logging errors.
        }
      })(),
    );

    return NextResponse.json({
      ticket: ticketWithQr,
      emailDelivery: { status: "skipped" as const, reason: "queued" as const },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
