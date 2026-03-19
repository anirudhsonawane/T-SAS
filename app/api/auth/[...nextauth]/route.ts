import NextAuth from "next-auth";

import { authOptions } from "./options";

// NextAuth relies on NEXTAUTH_URL for its state cookie. If the env var isn't set on Vercel,
// derive it from the public host so callbacks still validate.
function ensureNextAuthUrl() {
  const trimmedNextAuthUrl = process.env.NEXTAUTH_URL?.trim();

  if (process.env.NODE_ENV === "development") {
    const defaultDevUrl = `http://localhost:${process.env.PORT ?? "3000"}`;
    const normalizedNextAuthUrl = trimmedNextAuthUrl?.replace(/\/$/, "") ?? "";
    const isLocal =
      !!normalizedNextAuthUrl &&
      /^(https?:\/\/)?(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/.*)?$/.test(normalizedNextAuthUrl);

    process.env.NEXTAUTH_URL = (isLocal ? normalizedNextAuthUrl : defaultDevUrl).replace(/\/$/, "");
    return;
  }

  if (trimmedNextAuthUrl) {
    process.env.NEXTAUTH_URL = trimmedNextAuthUrl.replace(/\/$/, "");
    return;
  }

  const baseUrl = process.env.APP_URL || process.env.VERCEL_URL;
  if (!baseUrl) return;
  const normalized =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
  process.env.NEXTAUTH_URL = normalized.replace(/\/$/, "");
}

ensureNextAuthUrl();

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
