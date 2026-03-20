import nodemailer from "nodemailer";

type WelcomeEmailPayload = {
  to: string;
  name?: string | null;
  loginMethod: "email" | "google" | "apple" | "facebook" | "github";
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
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM_EMAIL;
  const secureRaw = process.env.SMTP_SECURE;

  const port = portRaw ? Number(portRaw) : 587;
  const secure = secureRaw ? secureRaw === "true" : port === 465;

  if (!host || !user || !pass || !from || !port || Number.isNaN(port)) return null;

  return { host, port, user, pass, from, secure };
}

function escapeHtml(value: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => map[char] ?? char);
}

/**
 * Send a welcome email to a newly signed up or registered user
 */
export async function sendWelcomeEmail(payload: WelcomeEmailPayload) {
  try {
    const smtp = getSmtpConfig();
    if (!smtp) {
      console.warn("[WelcomeEmail] SMTP not configured, skipping welcome email");
      return { ok: false as const, reason: "SMTP not configured" };
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    const appUrl = getAppUrl();
    const displayName = (payload.name?.trim() || "there").replaceAll(/\s+/g, " ");
    const loginMethodLabel = {
      email: "email",
      google: "Google",
      apple: "Apple",
      facebook: "Facebook",
      github: "GitHub",
    }[payload.loginMethod];

    const subject = "Welcome to TICKETr! 🎉";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f6f8; border-radius: 10px;">
        <h2 style="color: #111; margin-top: 0;">Welcome to TICKETr! 🎉</h2>
        
        <p>Hi <b>${escapeHtml(displayName)}</b>,</p>
        
        <p>Welcome to TICKETr! Your account has been successfully created using ${escapeHtml(loginMethodLabel)}.</p>
        
        <p>You're all set to:</p>
        <ul style="color: #333; line-height: 1.8;">
          <li>✅ Browse and book event tickets</li>
          <li>✅ Manage your tickets in your personal wallet</li>
          <li>✅ Receive instant ticket confirmations via email</li>
          <li>✅ Access secure QR codes at the venue</li>
        </ul>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="${appUrl}" style="display: inline-block; background: #111; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Explore Events
          </a>
        </div>
        
        <p>If you have any questions, feel free to reach out to us. Happy ticketing! 🎫</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #666; margin: 10px 0;">
          This is an automated welcome email from TICKETr. Please don't reply directly to this email.
        </p>
      </div>
    `;

    const text = `
Welcome to TICKETr!

Hi ${displayName},

Welcome to TICKETr! Your account has been successfully created using ${loginMethodLabel}.

You're all set to:
✅ Browse and book event tickets
✅ Manage your tickets in your personal wallet
✅ Receive instant ticket confirmations via email
✅ Access secure QR codes at the venue

Visit us: ${appUrl}

If you have any questions, feel free to reach out to us. Happy ticketing!

---
This is an automated welcome email from TICKETr. Please don't reply directly to this email.
    `;

    const info = await transporter.sendMail({
      from: smtp.from,
      to: payload.to,
      subject,
      html,
      text,
    });

    console.log(`[WelcomeEmail] Welcome email sent successfully to ${payload.to}`, {
      messageId: info.messageId,
      loginMethod: payload.loginMethod,
    });

    return { ok: true as const, messageId: info.messageId ?? null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const errorStack = err instanceof Error ? err.stack : "";
    console.error(`[WelcomeEmail] Failed to send welcome email to ${payload.to}:`, {
      message,
      errorStack,
      loginMethod: payload.loginMethod,
    });

    return { ok: false as const, reason: message };
  }
}
