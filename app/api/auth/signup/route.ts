import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getDb } from "@/app/lib/mongodb";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const DEFAULT_SALT_ROUNDS = 10;
const MIN_SALT_ROUNDS = 8;
function getSaltRounds() {
  const configured = Number(process.env.PASSWORD_HASH_SALT_ROUNDS);
  if (Number.isInteger(configured) && configured >= MIN_SALT_ROUNDS) {
    return configured;
  }
  return DEFAULT_SALT_ROUNDS;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { email?: string; password?: string; name?: string; mobile?: string }
      | null;

    const email = body?.email?.trim().toLowerCase() ?? "";
    const password = body?.password ?? "";
    const name = body?.name?.trim() ?? "";
    const mobile = body?.mobile?.trim() ?? "";

    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }
    if (!mobile) {
      return NextResponse.json({ ok: false, error: "Mobile number is required." }, { status: 400 });
    }
    if (!/^\+?[0-9]{8,15}$/.test(mobile.replace(/\s+/g, ""))) {
      return NextResponse.json({ ok: false, error: "Invalid mobile number." }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne<{ _id: unknown }>({ email });
    if (existing) {
      return NextResponse.json({ ok: false, error: "User already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, getSaltRounds());
    const now = new Date();

    const insertResult = await users.insertOne({
      email,
      name: name,
      image: null,
      mobile: mobile.replace(/\s+/g, ""),
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    if (!insertResult.insertedId) {
      console.error("[Signup] Failed to insert user: insertedId is missing", { email });
      return NextResponse.json({ ok: false, error: "Failed to create user." }, { status: 500 });
    }

    console.log("[Signup] User created successfully", { email, userId: insertResult.insertedId });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Signup failed.";
    const errorStack = err instanceof Error ? err.stack : "";
    console.error("[Signup] Error during user registration:", { message, errorStack, error: err });
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
