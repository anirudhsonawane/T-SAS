"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import type { VenueSection } from "./types";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SeatButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "h-9 rounded-xl px-3 text-xs font-semibold transition",
        "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10",
        selected ? "border-white/35 bg-white/12 text-white" : "",
        disabled ? "cursor-not-allowed opacity-40 hover:bg-white/5" : "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function TicketSelectionModal({
  open,
  section,
  onClose,
}: {
  open: boolean;
  section: VenueSection | null;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const seats = useMemo(() => {
    const rows = ["A", "B", "C", "D"];
    const numbers = Array.from({ length: 6 }, (_, i) => i + 1);
    return rows.flatMap((row) => numbers.map((n) => `${row}${n}`));
  }, []);

  const isSoldOut = section?.status === "sold_out";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/70 backdrop-blur"
            onClick={() => {
              setSelected([]);
              onClose();
            }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-[#0B0B0B]/80 text-white shadow-[0_22px_90px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,44,85,0.18),transparent_50%),radial-gradient(circle_at_80%_25%,rgba(138,43,226,0.16),transparent_55%)]"
            />

            <div className="relative p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">Ticket selection</p>
                  <h3 className="text-2xl font-semibold leading-tight">{section?.label ?? "Section"}</h3>
                  <p className="text-sm text-white/70">
                    {section ? (
                      <>
                        ₹{section.price} • {section.availabilityText}
                      </>
                    ) : null}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelected([]);
                    onClose();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10"
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </button>
              </div>

              {isSoldOut ? (
                <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/70">
                  This section is sold out.
                </div>
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-6 gap-2">
                    {seats.map((seat) => {
                      const isSelected = selected.includes(seat);
                      const disable = selected.length >= 4 && !isSelected;
                      return (
                        <SeatButton
                          key={seat}
                          label={seat}
                          selected={isSelected}
                          disabled={disable}
                          onClick={() => {
                            setSelected((prev) => {
                              if (prev.includes(seat)) return prev.filter((s) => s !== seat);
                              return [...prev, seat];
                            });
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/65">Select up to 4 seats.</p>
                    <button
                      type="button"
                      disabled={!selected.length}
                      className="h-11 rounded-2xl px-5 text-sm font-semibold text-white/95 disabled:cursor-not-allowed disabled:opacity-50 bg-[linear-gradient(135deg,rgba(255,44,85,0.85),rgba(138,43,226,0.7))] shadow-[0_18px_55px_rgba(255,44,85,0.18)] transition hover:brightness-110"
                      onClick={() => {
                        setSelected([]);
                        onClose();
                      }}
                    >
                      Continue ({selected.length})
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
