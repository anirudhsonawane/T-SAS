import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getDb } from "@/app/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase() ?? null;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const tickets = await db
      .collection("tickets")
      .find({ userEmail: email }, { projection: { _id: 0 } })
      .sort({ purchaseDate: -1 })
      .toArray();

    return NextResponse.json({ tickets });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch tickets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
