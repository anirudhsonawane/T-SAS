"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";

import { eventInfo } from "@/app/components/home/content";

type TicketPayload = {
  ticketId: string;
  userEmail?: string | null;
  eventId?: string;
  eventName: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventImageUrl?: string;
  attendeeName?: string;
  section?: string;
  ticketType: string;
  quantity: number;
  amount: number;
  qrCode: string;
  purchaseDate: string;
};

function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

function shortId(value: string) {
  if (!value) return "";
  if (value.length <= 12) return value;
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function sectionLabelFromTicketId(ticketId: string) {
  const hash = hashString(ticketId || "ticket");
  const letter = String.fromCharCode(65 + (hash % 8)); // A-H
  const number = (Math.floor(hash / 8) % 30) + 1; // 1-30
  return `${letter}${number}`;
}

function titleCase(value: string) {
  const text = value.trim();
  if (!text) return "";
  return text
    .split(/\s+/g)
    .map((word) => (word ? word[0]!.toUpperCase() + word.slice(1).toLowerCase() : ""))
    .join(" ");
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 2.8v3.2M17 2.8v3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4.8 9h14.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M6.5 5.8h11a2.7 2.7 0 0 1 2.7 2.7v10.3a2.7 2.7 0 0 1-2.7 2.7h-11a2.7 2.7 0 0 1-2.7-2.7V8.5a2.7 2.7 0 0 1 2.7-2.7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 7v6l3.5 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22s7-6.3 7-13a7 7 0 0 0-14 0c0 6.7 7 13 7 13Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TicketRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="inline-flex h-7 w-7 items-center justify-center text-slate-500">{icon}</span>
      <div className="min-w-0 flex-1 text-sm font-medium text-slate-700">{children}</div>
    </div>
  );
}

export function DigitalTicketHorizontal({ ticket }: { ticket: TicketPayload }) {
  const purchaseLabel = useMemo(() => {
    try {
      return new Date(ticket.purchaseDate).toLocaleString();
    } catch {
      return ticket.purchaseDate;
    }
  }, [ticket.purchaseDate]);

  const eventMeta = useMemo(() => {
    const map = new Map(eventInfo.map((row) => [row.label.toLowerCase(), row.value]));
    return {
      date: ticket.eventDate?.trim() || map.get("date") || "",
      time: ticket.eventTime?.trim() || map.get("time") || "",
      location: ticket.eventLocation?.trim() || map.get("location") || "",
    };
  }, [ticket.eventDate, ticket.eventLocation, ticket.eventTime]);

  const attendeeName = useMemo(() => {
    const explicit = ticket.attendeeName?.trim() ?? "";
    if (explicit) return explicit;
    const email = ticket.userEmail?.trim() ?? "";
    if (!email) return "Guest";
    const prefix = email.split("@")[0] ?? "";
    const cleaned = prefix.replace(/[._-]+/g, " ").trim();
    return titleCase(cleaned || "Guest");
  }, [ticket.attendeeName, ticket.userEmail]);

  const sectionLabel = useMemo(
    () => ticket.section?.trim() || sectionLabelFromTicketId(ticket.ticketId),
    [ticket.section, ticket.ticketId],
  );

  return (
    <div className="w-full">
      <section className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#ffffff,#f2f4f7)] text-slate-900 shadow-[0_26px_70px_rgba(0,0,0,0.45)] ring-1 ring-black/10">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(15,23,42,0.06),transparent_55%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-white/70" />

        <div aria-hidden className="pointer-events-none absolute left-0 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#050505]" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 h-16 w-16 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#050505]" />

        <div className="flex flex-col gap-6 px-10 py-5 sm:px-12 sm:py-7 lg:flex-row lg:items-stretch lg:gap-6 lg:px-10 lg:py-6">
          <div className="shrink-0 lg:w-[280px]">
            <div className="rounded-[22px] bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-slate-200">
                <img src={ticket.eventImageUrl?.trim() || "/bg-image.png"} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-balance break-words text-2xl font-semibold tracking-wide text-slate-900 sm:text-[34px] sm:leading-none lg:text-[32px]">
              {ticket.eventName.toUpperCase()}
            </h2>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.42em] text-slate-500">Live Tour</p>

            <div className="mt-4 h-px w-full bg-slate-200" />

            <div className="divide-y divide-slate-200">
              <TicketRow icon={<CalendarIcon />}>
                <span className="truncate">{eventMeta.date}</span>
              </TicketRow>
              <TicketRow icon={<ClockIcon />}>
                <span className="truncate">{eventMeta.time}</span>
              </TicketRow>
              <TicketRow icon={<PinIcon />}>
                <span className="truncate">{eventMeta.location}</span>
              </TicketRow>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-900">{ticket.ticketType}</p>
              <div className="mt-2 h-px w-full bg-slate-200" />

              <div className="divide-y divide-slate-200">
                <div className="flex items-center justify-between gap-6 py-2 text-sm">
                  <span className="text-slate-500">Section:</span>
                  <span className="font-medium text-slate-900">{sectionLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-6 py-2 text-sm">
                  <span className="text-slate-500">Name:</span>
                  <span className="truncate font-medium text-slate-900">{attendeeName}</span>
                </div>
                <div className="flex items-center justify-between gap-6 py-2 text-sm">
                  <span className="text-slate-500">Qty:</span>
                  <span className="font-medium text-slate-900">{ticket.quantity}</span>
                </div>
              </div>

              <div className="mt-3 flex items-end justify-end gap-2 text-slate-900">
                <span className="text-2xl font-semibold">₹{formatRupees(ticket.amount)}</span>
                <span className="pb-1 text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Total</span>
              </div>
            </div>
          </div>

          <div className="relative w-full shrink-0 pt-6 lg:w-[280px] lg:pt-0">
            <div
              aria-hidden
              className="hidden lg:absolute lg:left-0 lg:top-6 lg:bottom-6 lg:block lg:w-4 lg:-translate-x-1/2 lg:bg-[radial-gradient(circle,rgba(148,163,184,0.95)_1.35px,transparent_1.45px)] lg:[background-size:6px_10px] lg:[background-position:center]"
            />

            <div className="relative flex h-full w-full items-center justify-center rounded-[22px] bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(241,245,249,0.85))] p-5 ring-1 ring-black/5 lg:pl-8">
              <div aria-hidden className="absolute inset-x-6 top-0 h-px border-t border-dotted border-slate-300 lg:hidden" />
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
                <div className="rounded-2xl border border-dotted border-slate-300 p-3">
                  <img
                    src={ticket.qrCode}
                    alt="Ticket QR code"
                    className="mx-auto h-[140px] w-[140px] rounded-xl bg-white object-contain sm:h-[170px] sm:w-[170px] lg:h-[150px] lg:w-[150px]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-1 px-2 text-xs text-slate-600 sm:grid-cols-2 sm:px-0">
              <div className="min-w-0 text-center sm:text-left">
                <span className="text-slate-500">Ticket ID:</span>{" "}
                <span className="font-medium text-slate-700">{shortId(ticket.ticketId)}</span>
              </div>
              <div className="min-w-0 text-center sm:text-right">
                <span className="text-slate-500">Purchased:</span>{" "}
                <span className="truncate font-medium text-slate-700">{purchaseLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

