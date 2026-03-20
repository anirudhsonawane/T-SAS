import type { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcryptjs";

import { getDb } from "@/app/lib/mongodb";
import { sendWelcomeEmail } from "@/app/lib/welcomeEmail";

type OauthSyncPayload = {
  email: string;
  name: string | null;
  image: string | null;
  provider: string;
  providerAccountId: string | undefined;
  timestamp: Date;
};

async function syncOauthUser(payload: OauthSyncPayload): Promise<{ success: boolean; isNewUser: boolean; userId?: string }> {
  const maxRetries = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const db = await getDb();
      const users = db.collection("users");

      // Find existing user first
      const existingUser = await users.findOne<{ _id: { toString(): string } }>({ email: payload.email });
      const isNewUser = !existingUser;

      const result = await users.updateOne(
        { email: payload.email },
        {
          $set: {
            email: payload.email,
            name: payload.name,
            image: payload.image,
            updatedAt: payload.timestamp,
          },
          $setOnInsert: { createdAt: payload.timestamp },
          $addToSet: {
            oauth: {
              provider: payload.provider,
              providerAccountId: payload.providerAccountId,
            },
          },
        },
        { upsert: true },
      );

      const userId = result.upsertedId?.toString() || existingUser?._id.toString();

      console.log("[OAuth Sync] User synced successfully", {
        email: payload.email,
        provider: payload.provider,
        isNewUser,
        userId,
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
        attempt,
      });

      // Send welcome email only to new users
      if (isNewUser && userId) {
        try {
          void sendWelcomeEmail({
            to: payload.email,
            name: payload.name,
            loginMethod: payload.provider as "google" | "apple" | "facebook" | "github",
          });
        } catch (emailErr: unknown) {
          console.warn("[OAuth Sync] Failed to send welcome email (non-blocking):", {
            email: payload.email,
            error: emailErr,
          });
        }
      }

      return { success: true, isNewUser, userId };
    } catch (err: unknown) {
      lastError = err;
      const message = err instanceof Error ? err.message : "Unknown error";
      console.warn(`[OAuth Sync] Attempt ${attempt}/${maxRetries} failed for ${payload.email}:`, message);

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  // All retries exhausted
  const message = lastError instanceof Error ? lastError.message : "Unknown error";
  const errorStack = lastError instanceof Error ? lastError.stack : "";
  console.error("[OAuth Sync] Failed to sync OAuth user after all retries:", {
    email: payload.email,
    provider: payload.provider,
    message,
    errorStack,
    error: lastError,
  });

  // Don't block sign-in even if database sync fails
  return { success: false, isNewUser: false };
}

// Wrapper for backwards compatibility
async function syncOauthUserWithRetry(payload: OauthSyncPayload): Promise<void> {
  try {
    await syncOauthUser(payload);
  } catch (err: unknown) {
    console.error("[OAuth Sync] Unexpected error in wrapper:", err);
  }
}

const providers: NextAuthOptions["providers"] = [];

providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase() ?? "";
      const password = credentials?.password ?? "";
      if (!email || !password) {
        console.warn("[Auth] Missing email or password in credentials");
        return null;
      }

      try {
        const db = await getDb();
        const user = await db.collection("users").findOne<{
          _id: { toString(): string };
          email: string;
          name?: string | null;
          image?: string | null;
          passwordHash?: string | null;
        }>({ email });

        if (!user?.passwordHash) {
          console.warn("[Auth] User not found or no password hash", { email });
          return null;
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          console.warn("[Auth] Password mismatch", { email });
          return null;
        }

        console.log("[Auth] User authenticated successfully", { email, userId: user._id.toString() });
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[Auth] Error during credentials authorization:", { email, message, error: err });
        return null;
      }
    },
  }),
);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider === "credentials") return true;

      const email = user.email?.toLowerCase() ?? null;
      if (email) {
        const payload = {
          email,
          name: user.name ?? null,
          image: user.image ?? null,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          timestamp: new Date(),
        };
        // Sync OAuth user with retry logic (with welcome email)
        // Run in background but don't block sign-in
        void syncOauthUserWithRetry(payload);
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // @ts-expect-error next-auth default Session type doesn't include id
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
