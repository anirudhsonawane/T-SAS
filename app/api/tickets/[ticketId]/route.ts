import { NextRequest, NextResponse } from "next/server";

import { getDb } from "@/app/lib/mongodb";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, context: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await context.params;
  if (!ticketId) {
    return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const ticket = await db.collection("tickets").findOne({ ticketId }, { projection: { _id: 0 } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    return NextResponse.json({ ticket });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
