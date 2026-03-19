"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { eventInfo } from "@/app/components/home/content";

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
};

function QrIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 4h6v6H4V4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14 4h6v6h-6V4Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 14h6v6H4v-6Z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14 14h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-4 4h2v2h-2v-2Zm2-2h2v2h-2v-2Zm2 2h2v2h-2v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

const qrPanelVariants = {
  hidden: { opacity: 0, scaleY: 0.96, y: -8 },
  visible: { opacity: 1, scaleY: 1, y: 0 },
};

const qrPanelTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.25,
  duration: 0.3,
};

export function TicketPassCard({ ticket }: { ticket: TicketPayload }) {
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    // Warm image decode to avoid jank when expanding on low-end mobile devices.
    if (typeof window === "undefined") return;
    const img = new Image();
    img.src = ticket.qrCode;
    img.decode?.().catch(() => null);
  }, [ticket.qrCode]);

  const eventMeta = useMemo(() => {
    const map = new Map(eventInfo.map((row) => [row.label.toLowerCase(), row.value]));
    return {
      date: ticket.eventDate?.trim() || map.get("date") || "",
      time: ticket.eventTime?.trim() || map.get("time") || "",
      location: ticket.eventLocation?.trim() || map.get("location") || "",
    };
  }, [ticket.eventDate, ticket.eventLocation, ticket.eventTime]);

  const imageUrl = ticket.eventImageUrl?.trim() || "/bg-image.png";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 rounded-[42px] bg-[radial-gradient(circle_at_30%_20%,rgba(255,44,85,0.25),transparent_55%)] blur-xl sm:blur-2xl"
        />

        <section className="relative overflow-hidden rounded-[36px] bg-white text-slate-900 shadow-[0_22px_55px_rgba(0,0,0,0.35)] ring-1 ring-black/5 sm:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="p-4 sm:p-5">
            <div className="overflow-hidden rounded-[28px] bg-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
              <div className="aspect-[16/9] w-full">
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="mt-4 space-y-2 px-1">
              <h1 className="text-balance text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
                {ticket.eventName}
              </h1>
              {eventMeta.location ? (
                <p className="text-xs font-medium text-slate-500">{eventMeta.location}</p>
              ) : null}

              <div className="pt-1 text-[11px] text-slate-600">
                {eventMeta.date ? <span>{eventMeta.date}</span> : null}
                {eventMeta.date && eventMeta.time ? <span className="px-2 text-slate-300">•</span> : null}
                {eventMeta.time ? <span>{eventMeta.time}</span> : null}
              </div>
            </div>

            <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/60">
                <button
                  type="button"
                  onClick={() => setShowCode((prev) => !prev)}
                  className="flex-1 rounded-xl bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.10)] ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>SHOW TICKET</span>
                    <span className="text-slate-500">
                      <QrIcon />
                    </span>
                    <span>CODE</span>
                  </span>
                </button>
              </div>

              <AnimatePresence initial={false} mode="popLayout">
                {showCode && (
                  <motion.div
                    key="qr-panel"
                    variants={qrPanelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={qrPanelTransition}
                    style={{ transformOrigin: "top", willChange: "transform, opacity" }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="mx-auto flex w-fit flex-col items-center gap-3">
                        <img
                          src={ticket.qrCode}
                          alt="Ticket QR code"
                          decoding="async"
                          loading="eager"
                          className="h-44 w-44 rounded-2xl border border-slate-200 bg-white p-2"
                        />
                        <p className="text-center text-xs text-slate-600">
                          Ticket ID: <span className="font-medium text-slate-800">{ticket.ticketId}</span>
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                        <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/60">
                          <p className="font-semibold uppercase tracking-[0.22em] text-slate-500">Type</p>
                          <p className="mt-1 font-medium text-slate-800">{ticket.ticketType}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3 text-right ring-1 ring-slate-200/60">
                          <p className="font-semibold uppercase tracking-[0.22em] text-slate-500">Qty</p>
                          <p className="mt-1 font-medium text-slate-800">{ticket.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
