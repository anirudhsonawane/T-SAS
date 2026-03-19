/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");
const nodemailer = require("nodemailer");

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (!key) continue;
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  const secure =
    (process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;

  if (!host || !user || !pass || !from || !port || Number.isNaN(port)) {
    console.error(
      "Missing/invalid SMTP config. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in ticket-r/.env.local.",
    );
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.verify();
  const info = await transporter.sendMail({
    from,
    to: user,
    subject: "Ticket-r SMTP test",
    text: "If you received this email, SMTP is working.",
  });

  console.log("SENT", info && info.messageId ? info.messageId : "");
}

main().catch((error) => {
  console.error("FAILED", error && error.message ? error.message : error);
  process.exit(1);
});

