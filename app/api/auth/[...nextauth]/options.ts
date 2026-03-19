import type { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcryptjs";

import { getDb } from "@/app/lib/mongodb";

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
      if (!email || !password) return null;

      try {
        const db = await getDb();
        const user = await db.collection("users").findOne<{
          _id: { toString(): string };
          email: string;
          name?: string | null;
          image?: string | null;
          passwordHash?: string | null;
        }>({ email });

        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        };
      } catch {
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
      const now = new Date();

      try {
        const db = await getDb();
        const users = db.collection("users");

        if (email) {
          await users.updateOne(
            { email },
            {
              $set: {
                email,
                name: user.name ?? null,
                image: user.image ?? null,
                updatedAt: now,
              },
              $setOnInsert: { createdAt: now },
              $addToSet: {
                oauth: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            },
            { upsert: true },
          );
        }
      } catch {
        // If Mongo is down, still allow OAuth sign-in.
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
