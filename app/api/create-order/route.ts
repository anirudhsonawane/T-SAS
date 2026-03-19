import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/* -----------------------------
   Request Body Type
----------------------------- */

type CreateOrderBody = {
  amount: number;
  currency?: string;
  receipt?: string;
  ticketType: string;
  quantity: number;
  eventId: string;
  userEmail?: string;
};

/* -----------------------------
   POST Handler
----------------------------- */

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment gateway is not configured." }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const body: CreateOrderBody = await request.json();

    const {
      amount,
      currency = "INR",
      receipt,
      ticketType,
      quantity,
      eventId,
      userEmail,
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }


    /* Convert rupees -> paise for Razorpay */
    const amountInPaise = Math.round(amount * 100);

    /* Create Razorpay Order */
    const order = await razorpay.orders.create({
  amount: amountInPaise,
  currency,
  receipt: receipt ?? `tkt_${Date.now()}`,
  notes: {
    ticketType,
    quantity: String(quantity),
    eventId,
    userEmail: userEmail ?? "anonymous",
  },
});

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });

  } catch (error) {
    console.error("Razorpay Order Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create Razorpay order";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
