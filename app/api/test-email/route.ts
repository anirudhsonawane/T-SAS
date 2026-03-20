import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Test endpoint to verify SMTP email functionality
 * POST /api/test-email - Sends a test email using configured SMTP settings
 */

export async function POST(req: Request) {
  try {
    console.log("[Email Test] Testing email service...");
    
    const body = (await req.json().catch(() => null)) as {
      recipientEmail?: string;
    } | null;
    
    const recipientEmail = body?.recipientEmail ?? process.env.SMTP_FROM_EMAIL;
    
    if (!recipientEmail) {
      return NextResponse.json({
        success: false,
        error: "No recipient email provided and SMTP_FROM_EMAIL not configured",
      }, { status: 400 });
    }
    
    // Verify SMTP configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : null;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpFromEmail = process.env.SMTP_FROM_EMAIL;
    
    console.log("[Email Test] SMTP Configuration:", {
      host: smtpHost ? "✓" : "✗",
      port: smtpPort ? `✓ (${smtpPort})` : "✗",
      user: smtpUser ? "✓" : "✗",
      password: smtpPass ? "✓" : "✗",
      fromEmail: smtpFromEmail ? "✓" : "✗",
    });
    
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFromEmail) {
      const missing = [
        !smtpHost && "SMTP_HOST",
        !smtpPort && "SMTP_PORT",
        !smtpUser && "SMTP_USER",
        !smtpPass && "SMTP_PASSWORD",
        !smtpFromEmail && "SMTP_FROM_EMAIL",
      ].filter(Boolean);
      
      return NextResponse.json({
        success: false,
        error: "Missing SMTP configuration",
        missingEnvVars: missing,
      }, { status: 400 });
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    
    // Verify connection
    console.log("[Email Test] Verifying SMTP connection...");
    await transporter.verify();
    console.log("[Email Test] SMTP connection verified successfully");
    
    // Send test email
    const testTimestamp = new Date().toISOString();
    const mailOptions = {
      from: smtpFromEmail,
      to: recipientEmail,
      subject: `[TICKETr Test Email] ${testTimestamp}`,
      html: `
        <h2>TICKETr Email Test</h2>
        <p>This is a test email from your TICKETr ticketing application.</p>
        <p><strong>Timestamp:</strong> ${testTimestamp}</p>
        <p><strong>To Email:</strong> ${recipientEmail}</p>
        <p>If you received this, SMTP is working correctly!</p>
        <hr />
        <p><small>This is an automated test email. Please ignore.</small></p>
      `,
      text: `
TICKETr Email Test
This is a test email from your TICKETr ticketing application.
Timestamp: ${testTimestamp}
To Email: ${recipientEmail}
If you received this, SMTP is working correctly!
      `,
    };
    
    console.log("[Email Test] Sending test email to:", recipientEmail);
    const info = await transporter.sendMail(mailOptions);
    console.log("[Email Test] Email sent successfully:", info);
    
    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      emailInfo: {
        messageId: info.messageId,
        response: info.response,
        recipientEmail,
        timestamp: testTimestamp,
      },
    }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const errorStack = err instanceof Error ? err.stack : "";
    console.error("[Email Test] Error sending test email:", { message, errorStack, error: err });
    
    return NextResponse.json({
      success: false,
      error: message,
      errorDetails: process.env.NODE_ENV === "development" ? errorStack : undefined,
    }, { status: 500 });
  }
}
