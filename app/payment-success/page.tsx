"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DigitalTicketHorizontal } from "@/app/components/tickets/DigitalTicketHorizontal";

type TicketPayload = {
  ticketId: string;
  eventName: string;
  ticketType: string;
  quantity: number;
  amount: number;
  qrCode: string;
  purchaseDate: string;
};

export default function PaymentSuccessPage() {
  const [ticket, setTicket] = useState<TicketPayload | null>(() => {
    try {
      const storedTicket = sessionStorage.getItem("latestTicket") ?? localStorage.getItem("latestTicket");
      if (!storedTicket) return null;
      return JSON.parse(storedTicket) as TicketPayload;
    } catch {
      return null;
    }
  });
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (ticket) return;
    const ticketId = searchParams.get("ticketId");
    if (!ticketId) return;

    queueMicrotask(() => setLoading(true));
    queueMicrotask(() => setTicketError(null));
    fetch(`/api/tickets/${encodeURIComponent(ticketId)}`)
      .then(async (res) => {
        const payload = (await res.json().catch(() => ({}))) as { ticket?: TicketPayload; error?: string };
        if (!res.ok) throw new Error(payload.error ?? "Unable to fetch ticket");
        if (!payload.ticket) throw new Error("Ticket not found");
        setTicket(payload.ticket);
        const ticketJson = JSON.stringify(payload.ticket);
        sessionStorage.setItem("latestTicket", ticketJson);
        localStorage.setItem("latestTicket", ticketJson);
      })
      .catch((err: unknown) => {
        setTicketError(err instanceof Error ? err.message : "Unable to fetch ticket");
      })
      .finally(() => setLoading(false));
  }, [searchParams, ticket]);

  if (loading && !ticket) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Loading ticket details...</p>
        </div>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 py-12 text-center">
          <h1 className="text-2xl font-semibold">No ticket found</h1>
          <p className="text-sm text-white/70">
            {ticketError ?? "Complete a purchase first, or open this page right after payment."}
          </p>
          <Link
            href="/pricing"
            className="rounded-full bg-gradient-to-r from-[#ff3b3b] to-[#ff6c3d] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:scale-[1.01]"
          >
            Book pricing
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-6 px-4 py-12">
        <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b1b1f] to-[#0b0206] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
          <p className="text-sm uppercase tracking-[0.5em] text-pink-500">Payment Success</p>
          <h1 className="mt-4 text-4xl font-semibold">Thank you!</h1>
          <p className="mt-2 text-sm text-white/70">Your digital ticket is ready.</p>

          <div className="mt-8">
            <DigitalTicketHorizontal ticket={ticket} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ticket-wallet"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur transition hover:bg-white/10"
            >
              View Ticket
            </Link>
            <Link
              href="/"
              className="rounded-full bg-gradient-to-r from-[#ff3b3b] to-[#ff6c3d] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:scale-[1.01]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
