"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Navbar } from "@/app/components/home/Navbar";
import { authNavLinks, navLinks } from "@/app/components/home/content";
import { TicketPassCard } from "@/app/components/tickets/TicketPassCard";

type TicketPayload = {
  ticketId: string;
  userEmail?: string | null;
  eventName: string;
  ticketType: string;
  quantity: number;
  amount: number;
  qrCode: string;
  purchaseDate: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventImageUrl?: string;
  attendeeName?: string;
  section?: string;
};

export default function TicketPage() {
  const [tickets, setTickets] = useState<TicketPayload[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedList = localStorage.getItem("tickets");
      const parsed = storedList ? (JSON.parse(storedList) as unknown) : [];
      const list = Array.isArray(parsed) ? (parsed as TicketPayload[]) : [];
      const normalized = list.filter((ticket) => typeof ticket?.ticketId === "string");
      if (normalized.length) {
        setTickets(normalized);
      }
    } catch {
      // ignore malformed storage
    }
  }, []);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const routeLinks = useMemo(
    () =>
      navLinks.map((link) => {
        if (!link.href.startsWith("#")) return link;
        // From /ticket-wallet, Pricing should take you to ticket cards on /pricing.
        if (link.href === "#pricing") return { ...link, href: "/pricing#pricing" };
        return { ...link, href: `/${link.href}` };
      }),
    [],
  );

  useEffect(() => {
    queueMicrotask(() => setLoading(true));
    queueMicrotask(() => setTicketError(null));

    fetch("/api/tickets")
      .then(async (res) => {
        const payload = (await res.json().catch(() => ({}))) as { tickets?: TicketPayload[]; error?: string };
        if (!res.ok) return null; // unauthenticated or error -> fall back to local storage
        const serverTickets = Array.isArray(payload.tickets) ? payload.tickets : [];
        setTickets(serverTickets);
        localStorage.setItem("tickets", JSON.stringify(serverTickets.slice(0, 25)));
        return serverTickets;
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const ticketId = searchParams.get("ticketId");
    if (!ticketId) return;

    const hasTicket = tickets.some((t) => t.ticketId === ticketId);
    if (hasTicket) return;

    queueMicrotask(() => setLoading(true));
    queueMicrotask(() => setTicketError(null));
    fetch(`/api/tickets/${encodeURIComponent(ticketId)}`)
      .then(async (res) => {
        const payload = (await res.json().catch(() => ({}))) as { ticket?: TicketPayload; error?: string };
        if (!res.ok) throw new Error(payload.error ?? "Unable to fetch ticket");
        if (!payload.ticket) throw new Error("Ticket not found");

        setTickets((prev) => {
          const next = [payload.ticket!, ...prev].filter(
            (item, index, arr) => arr.findIndex((other) => other.ticketId === item.ticketId) === index,
          );
          localStorage.setItem("tickets", JSON.stringify(next.slice(0, 25)));
          localStorage.setItem("latestTicket", JSON.stringify(payload.ticket));
          sessionStorage.setItem("latestTicket", JSON.stringify(payload.ticket));
          return next;
        });
      })
      .catch((err: unknown) => {
        setTicketError(err instanceof Error ? err.message : "Unable to fetch ticket");
      })
      .finally(() => setLoading(false));
  }, [searchParams, tickets]);

  return (
    <main className="min-h-dvh bg-[#050505] text-white">
      <div className="px-4 pt-5 sm:px-6 lg:px-10 xl:px-14">
        <Navbar links={routeLinks} unauthenticatedLinks={authNavLinks} brand="Shub>Innovation" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-10 xl:px-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-white/60">Digital Ticket</p>
            <h1 className="mt-3 text-3xl font-semibold">Your all Tickets are here.</h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Keep this page handy. You can scan the QR code at the venue entrance.
            </p>
          </div>
        </div>

        {tickets.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {tickets.map((t) => (
              <TicketPassCard key={t.ticketId} ticket={t} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/80">
            {loading ? "Loading tickets..." : ticketError ?? "No tickets found yet."}
          </div>
        )}
      </div>
    </main>
  );
}
