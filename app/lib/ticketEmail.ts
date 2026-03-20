import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import path from "node:path";
import { readFile } from "node:fs/promises";

type TicketEmailPayload = {
  to: string;
  ticketId: string;
  name?: string | null;
  eventName: string;
  eventDate?: string | null;
  eventTime?: string | null;
  venue?: string | null;
  ticketType: string;
  seat?: string | null;
  quantity: number;
  amount: number;
  purchaseDate: string;
  qrCodeDataUrl?: string | null;
};

function getAppUrl() {
  const url =
    process.env.APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_URL ||
    "";

  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const secureRaw = process.env.SMTP_SECURE;

  const port = portRaw ? Number(portRaw) : 587;
  const secure = secureRaw ? secureRaw === "true" : port === 465;

  const missing = [
    !host && "SMTP_HOST",
    !user && "SMTP_USER",
    !pass && "SMTP_PASS",
    !from && "SMTP_FROM",
    !port && "SMTP_PORT",
  ].filter(Boolean);

  if (missing.length > 0) {
    console.error("[SMTP] Missing required configuration:", { missing });
    return null;
  }

  if (Number.isNaN(port)) {
    console.error("[SMTP] Invalid SMTP_PORT:", portRaw);
    return null;
  }

  console.log("[SMTP] Configuration loaded successfully", {
    host,
    port,
    user,
    secure,
    from,
  });

  return { host, port, user, pass, from, secure };
}

function parseDataUrlPng(dataUrl: string) {
  const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  const b64 = match?.[1];
  if (!b64) return null;
  return Buffer.from(b64, "base64");
}

async function createTicketPdfBuffer(payload: TicketEmailPayload) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Ticket - ${payload.eventName}`);
  pdf.setSubject("Event ticket");

  const page = pdf.addPage([595.28, 841.89]); // A4 in points
  const { width, height } = page.getSize();

  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const slate900 = rgb(0.0588, 0.0902, 0.1647); // #0f172a
  const slate800 = rgb(0.1176, 0.1608, 0.2314); // #1e293b
  const slate600 = rgb(0.2784, 0.3333, 0.4); // #475569
  const slate500 = rgb(0.3922, 0.4471, 0.5216); // #64748b
  const slate200 = rgb(0.8863, 0.9098, 0.9412); // #e2e8f0
  const slate100 = rgb(0.949, 0.957, 0.969); // #f1f5f9
  const white = rgb(1, 1, 1);

  function drawRoundedRect(args: {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
    fill: ReturnType<typeof rgb>;
    opacity?: number;
  }) {
    const { x, y, w, h, r, fill, opacity } = args;
    const clampedR = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    page.drawRectangle({ x: x + clampedR, y, width: w - clampedR * 2, height: h, color: fill, opacity });
    page.drawRectangle({ x, y: y + clampedR, width: w, height: h - clampedR * 2, color: fill, opacity });
    page.drawCircle({ x: x + clampedR, y: y + clampedR, size: clampedR, color: fill, opacity });
    page.drawCircle({ x: x + w - clampedR, y: y + clampedR, size: clampedR, color: fill, opacity });
    page.drawCircle({ x: x + clampedR, y: y + h - clampedR, size: clampedR, color: fill, opacity });
    page.drawCircle({ x: x + w - clampedR, y: y + h - clampedR, size: clampedR, color: fill, opacity });
  }

  function drawRoundedBorder(args: {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
    borderWidth: number;
    border: ReturnType<typeof rgb>;
    fill: ReturnType<typeof rgb>;
    opacity?: number;
  }) {
    const { x, y, w, h, r, borderWidth, border, fill, opacity } = args;
    drawRoundedRect({ x, y, w, h, r, fill: border, opacity });
    drawRoundedRect({
      x: x + borderWidth,
      y: y + borderWidth,
      w: w - borderWidth * 2,
      h: h - borderWidth * 2,
      r: Math.max(0, r - borderWidth),
      fill,
      opacity,
    });
  }

  function textWidth(text: string, size: number, bold = false) {
    const font = bold ? fontBold : fontRegular;
    return font.widthOfTextAtSize(text, size);
  }

  function wrapLines(text: string, maxWidth: number, size: number, bold = false, maxLines = 2) {
    const font = bold ? fontBold : fontRegular;
    const words = text.replaceAll(/\s+/g, " ").trim().split(" ").filter(Boolean);
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate;
        // Removed SHOW TICKET [QR CODE LOGO] CODE bar

  const pad = 18;
  const innerX = cardX + pad;
  const innerY = cardY + pad;
  const innerW = cardW - pad * 2;
  const innerH = cardH - pad * 2;

  // Image frame
  const imageFrameR = 28;
  const imageFrameH = 220;
  const imageFrameY = cardY + cardH - pad - imageFrameH;
  drawRoundedBorder({
    x: innerX,
    y: imageFrameY,
    w: innerW,
    h: imageFrameH,
    r: imageFrameR,
    borderWidth: 1,
    border: rgb(0, 0, 0),
    fill: slate100,
    opacity: 0.05,
  });
  drawRoundedRect({ x: innerX + 1, y: imageFrameY + 1, w: innerW - 2, h: imageFrameH - 2, r: imageFrameR - 1, fill: slate100 });

  // Embed image (fallback to bg-image.png)
  try {
    const imgPath = path.join(process.cwd(), "public", "bg-image.png");
    const imgBytes = await readFile(imgPath);
    const embedded = await pdf.embedPng(imgBytes);
    const targetW = innerW - 2;
    const targetH = imageFrameH - 2;
    const scale = Math.max(targetW / embedded.width, targetH / embedded.height);
    const drawW = embedded.width * scale;
    const drawH = embedded.height * scale;
    const drawX = innerX + 1 + Math.floor((targetW - drawW) / 2);
    const drawY = imageFrameY + 1 + Math.floor((targetH - drawH) / 2);
    page.drawImage(embedded, { x: drawX, y: drawY, width: drawW, height: drawH });
  } catch {
    // If image can't be read, keep the placeholder frame.
  }

  // Title + meta
  const title = payload.eventName?.trim() || "Ticket";
  const location = payload.venue?.trim() || "TBA";
  const date = payload.eventDate?.trim() || "TBA";
  const time = payload.eventTime?.trim() || "TBA";

  let metaY = imageFrameY - 18;
  const titleLines = wrapLines(title, innerW - 4, 16, true, 2);
  for (const line of titleLines) {
    page.drawText(line, { x: innerX + 2, y: metaY, size: 16, font: fontBold, color: slate900, maxWidth: innerW - 4 });
    metaY -= 18;
  }

  const locationLine = wrapLines(location, innerW - 4, 10, true, 1)[0];
  if (locationLine) {
    page.drawText(locationLine, { x: innerX + 2, y: metaY, size: 10, font: fontBold, color: slate500, maxWidth: innerW - 4 });
    metaY -= 16;
  }

  const metaLine = `${date}  •  ${time}`;
  page.drawText(metaLine, { x: innerX + 2, y: metaY, size: 9, font: fontRegular, color: slate600, maxWidth: innerW - 4 });
  metaY -= 10;

  // Divider (dashed)
  const dividerY = Math.max(metaY - 10, cardY + pad + 360);
  drawDottedDivider(innerX, dividerY, innerW);

  // Button row container
  const buttonWrapY = dividerY - 56;
  drawRoundedBorder({ x: innerX, y: buttonWrapY, w: innerW, h: 44, r: 18, borderWidth: 1, border: slate200, fill: slate100 });

  // Button inside
  const buttonX = innerX + 10;
  const buttonY = buttonWrapY + 8;
  const buttonW = innerW - 20;
  const buttonH = 28;
  drawRoundedBorder({ x: buttonX, y: buttonY, w: buttonW, h: buttonH, r: 12, borderWidth: 1, border: slate200, fill: white });

  // Button text: SHOW TICKET [QR ICON] CODE
  const labelLeft = "SHOW TICKET";
  const labelRight = "CODE";
  const labelSize = 9;
  const gap = 10;
  const iconSize = 12;
  const totalW = textWidth(labelLeft, labelSize, true) + gap + iconSize + gap + textWidth(labelRight, labelSize, true);
  const startX = buttonX + Math.floor((buttonW - totalW) / 2);
  const textY = buttonY + 10;

  page.drawText(labelLeft, { x: startX, y: textY, size: labelSize, font: fontBold, color: slate800 });

  // Draw a simple QR code icon (3x3 grid, some filled)
  const iconX = startX + textWidth(labelLeft, labelSize, true) + gap;
  const iconY = buttonY + 8;
  const qrBlock = 2.2;
  const qrPad = 1.2;
  const qrColor = slate500;
  // 3x3 grid, fill some blocks for QR look
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      // Fill corners and center for a QR-like look
      if ((row === 0 && col === 0) || (row === 0 && col === 2) || (row === 2 && col === 0) || (row === 2 && col === 2) || (row === 1 && col === 1)) {
        page.drawRectangle({
          x: iconX + col * (qrBlock + qrPad),
          y: iconY + (2 - row) * (qrBlock + qrPad),
          width: qrBlock,
          height: qrBlock,
          color: qrColor,
        });
      }
    }
  }
  page.drawText(labelRight, {
    x: iconX + iconSize + gap - 2,
    y: textY,
    size: labelSize,
    font: fontBold,
    color: slate800,
  });

  // Expanded QR section (uplifted QR code)
  const minQrSectionY = cardY + pad + 10;
  const maxQrSectionTop = buttonWrapY - 14;
  const desiredQrSectionH = 292;
  const qrSectionH = Math.max(250, Math.min(desiredQrSectionH, maxQrSectionTop - minQrSectionY));
  // Move the QR section up by 32px for better balance
  const uplift = 32;
  const qrSectionY = maxQrSectionTop - qrSectionH + uplift;
  drawRoundedBorder({ x: innerX, y: qrSectionY, w: innerW, h: qrSectionH, r: 24, borderWidth: 1, border: slate200, fill: white });

  // QR image box
  const qrBoxW = 180;
  const qrBoxH = 180;
  const qrBoxX = innerX + Math.floor((innerW - qrBoxW) / 2);
  const qrBoxY = qrSectionY + qrSectionH - qrBoxH - 64 + uplift;
  drawRoundedBorder({ x: qrBoxX, y: qrBoxY, w: qrBoxW, h: qrBoxH, r: 16, borderWidth: 1, border: slate200, fill: white });

  const qrPng = payload.qrCodeDataUrl ? parseDataUrlPng(payload.qrCodeDataUrl) : null;
  if (qrPng) {
    const embeddedQr = await pdf.embedPng(qrPng);
    const qrPad = 14;
    const target = qrBoxW - qrPad * 2;
    page.drawImage(embeddedQr, {
      x: qrBoxX + qrPad,
      y: qrBoxY + qrPad,
      width: target,
      height: target,
    });
  }

  // Ticket ID line
  const ticketIdLabel = `Ticket ID: ${payload.ticketId}`;
  const idSize = 9;
  const idLines = wrapLines(ticketIdLabel, innerW - 24, idSize, false, 2);
  let idY = qrBoxY - 18;
  for (const line of idLines) {
    const idW = textWidth(line, idSize, false);
    page.drawText(line, { x: innerX + Math.floor((innerW - idW) / 2), y: idY, size: idSize, font: fontRegular, color: slate600 });
    idY -= 12;
  }

  // Bottom pills: Type / Qty (no artifact between)
  const pillY = qrSectionY + 14;
  const pillGap = 10;
  const pillW = Math.floor((innerW - pillGap) / 2);
  const pillH = 46;

  // TYPE
  drawRoundedBorder({ x: innerX, y: pillY, w: pillW, h: pillH, r: 18, borderWidth: 1, border: slate200, fill: slate100 });
  page.drawText("TYPE", { x: innerX + 14, y: pillY + 28, size: 9, font: fontBold, color: slate500 });
  const typeLine = wrapLines(payload.ticketType, pillW - 22, 11, true, 1)[0] || payload.ticketType;
  page.drawText(typeLine, { x: innerX + 14, y: pillY + 12, size: 11, font: fontBold, color: slate800, maxWidth: pillW - 22 });

  // QTY
  const qtyX = innerX + pillW + pillGap;
  drawRoundedBorder({ x: qtyX, y: pillY, w: pillW, h: pillH, r: 18, borderWidth: 1, border: slate200, fill: slate100 });
  const qtyLabel = "QTY";
  page.drawText(qtyLabel, { x: qtyX + pillW - 14 - textWidth(qtyLabel, 9, true), y: pillY + 28, size: 9, font: fontBold, color: slate500 });
  const qtyValue = String(payload.quantity);
  page.drawText(qtyValue, { x: qtyX + pillW - 14 - textWidth(qtyValue, 11, true), y: pillY + 12, size: 11, font: fontBold, color: slate800 });

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

export async function sendTicketEmail(payload: TicketEmailPayload) {
  console.log("[TicketEmail] Starting email send process", { to: payload.to, ticketId: payload.ticketId });

  const smtp = getSmtpConfig();
  if (!smtp) {
    const reason = "SMTP not configured - missing environment variables";
    console.warn("[TicketEmail] SMTP configuration missing:", { to: payload.to, reason });
    return { ok: false as const, skipped: true as const, reason };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
      greetingTimeout: 30000, // 30 seconds
      connectionTimeout: 30000, // 30 seconds
      socketTimeout: 30000, // 30 seconds
    });

    console.log("[TicketEmail] Nodemailer transporter created", { host: smtp.host, port: smtp.port });

    const appUrl = getAppUrl();
    const ticketUrl = appUrl ? `${appUrl}/ticket-wallet?ticketId=${encodeURIComponent(payload.ticketId)}` : "";
    const subject = "You're In! Here's Your Ticket 🎫";
    const displayName = (payload.name?.trim() || "there").replaceAll(/\s+/g, " ");
    const displayEventDate = payload.eventDate?.trim() || "TBA";
    const displayEventTime = payload.eventTime?.trim() || "TBA";
    const displayVenue = payload.venue?.trim() || "TBA";
    const displaySeat = payload.seat?.trim() || "";

    const textLines = [
      `Ticket Confirmation`,
      ``,
      `Hello ${displayName},`,
      ``,
      `Event: ${payload.eventName}`,
      `Date: ${displayEventDate}`,
      `Time: ${displayEventTime}`,
      `Venue: ${displayVenue}`,
      `Ticket Type: ${payload.ticketType}`,
      ...(displaySeat ? [`Seat: ${displaySeat}`] : []),
      `Ticket ID: ${payload.ticketId}`,
      ticketUrl ? `` : ``,
      ticketUrl ? `View your ticket: ${ticketUrl}` : ``,
    ].filter(Boolean);

    console.log("[TicketEmail] Creating PDF buffer", { ticketId: payload.ticketId });
    const pdfBuffer = await createTicketPdfBuffer(payload);
    console.log("[TicketEmail] PDF created successfully", { ticketId: payload.ticketId, sizeBytes: pdfBuffer.length });

    const qrPng = payload.qrCodeDataUrl ? parseDataUrlPng(payload.qrCodeDataUrl) : null;
    const qrSrc = payload.qrCodeDataUrl?.trim() || "";

    const html = `
      <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:20px; background:#f5f6f8; border-radius:10px">
        <h2 style="color:#111">🎟 Ticket Confirmation</h2>

        <p>Hello <b>${escapeHtml(displayName)}</b>,</p>

        <p>Your ticket purchase was successful. We're excited to see you at the event!</p>

        <hr style="border:none; border-top:1px solid #ddd">

        <h3 style="margin-bottom:5px">${escapeHtml(payload.eventName)}</h3>

        <p>
          📅 <b>Date:</b> ${escapeHtml(displayEventDate)} <br>
          ⏰ <b>Time:</b> ${escapeHtml(displayEventTime)} <br>
          📍 <b>Venue:</b> ${escapeHtml(displayVenue)}
        </p>

        <p>
          🎫 <b>Ticket Type:</b> ${escapeHtml(payload.ticketType)} <br>
          ${displaySeat ? `💺 <b>Seat:</b> ${escapeHtml(displaySeat)}` : ""}
        </p>

        <div style="text-align:center; margin:20px 0">
          <p><b>Please Find Your Digital Ticket and QR code of the ticket is attached below.</b></p>
        </div>

        <p>Please present the attached QR code PDF at the venue entrance for quick check-in.</p>

        <hr style="border:none; border-top:1px solid #ddd">

        <p style="font-size:14px; color:#666">
          If you have any questions, feel free to contact our support team.
        </p>

        <p style="font-size:14px; color:#999">
          See you there! 🎶 <br>
          Team Ticket-r
        </p>

        ${
          ticketUrl
            ? `<p style="margin-top:18px"><a href="${ticketUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 14px;border-radius:999px;text-decoration:none;font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase">View Ticket</a></p>`
            : ""
        }
      </div>
    `;

    console.log("[TicketEmail] Sending email via SMTP", { to: payload.to, ticketId: payload.ticketId, subject });
    const info = await transporter.sendMail({
      from: smtp.from,
      to: payload.to,
      subject,
      text: textLines.join("\n"),
      html,
      attachments: [
        {
          filename: `ticket-${payload.ticketId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("[TicketEmail] Email sent successfully", {
      to: payload.to,
      ticketId: payload.ticketId,
      messageId: info.messageId,
      response: info.response,
    });

    return { ok: true as const, messageId: typeof info?.messageId === "string" ? info.messageId : undefined };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const errorStack = err instanceof Error ? err.stack || "" : "";
    console.error("[TicketEmail] Failed to send email", {
      to: payload.to,
      ticketId: payload.ticketId,
      message,
      errorStack: (errorStack || "").split("\n").slice(0, 5).join("\n"),
      error: err,
    });
    return { ok: false as const, reason: message };
  }
}



function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
  }
