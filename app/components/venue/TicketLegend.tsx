"use client";

import { motion } from "framer-motion";

import type { VenueSection } from "./types";

function TicketIcon({ className }: { className: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M5 7.5a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7.5c0 1 .6 1.9 1.5 2.3v4.4A2.5 2.5 0 0 0 19 16.5 2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5c0-1-.6-1.9-1.5-2.3V9.8A2.5 2.5 0 0 0 5 7.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M10 8v8" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="4 4" />
    </svg>
  );
}

function StubIcon({ className }: { className: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M6.5 8.5h11a2 2 0 0 1 2 2v3.2c-1 .3-1.7 1.2-1.7 2.3A2.5 2.5 0 0 1 15.3 18.5H8.7A2.5 2.5 0 0 1 6.2 16c0-1.1-.7-2-1.7-2.3V10.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 10.2v6.6"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

function dotClass(accent: VenueSection["accent"]) {
  switch (accent) {
    case "purple":
      return "bg-[#D35CFF]";
    case "yellow":
      return "bg-[#FFD24A]";
    case "orange":
      return "bg-[#B35A00]";
    case "red":
      return "bg-[#FF3B30]";
    default:
      return "bg-white";
  }
}

export function TicketLegend({ sections }: { sections: VenueSection[] }) {
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <div className="grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-4 md:gap-0">
        {sections.map((section) => {
          const isSoldOut = section.status === "sold_out";
          return (
            <motion.div
              key={section.id}
              variants={item}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative px-2 py-2 md:px-6 md:py-6 md:border-r md:border-white/10 last:md:border-r-0"
            >
              <div className="flex items-center gap-3">
                <span className={`h-4 w-4 rounded ${dotClass(section.accent)}`} />
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/90">{section.label}</p>
              </div>

              <div className="mt-5 grid gap-3 text-[13px] text-white/75 sm:text-xs">
                <div className="flex items-center gap-3">
                  <TicketIcon className="text-white/70" />
                  <span>Price :</span>
                  <span className="font-semibold text-white/95">₹{section.price}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StubIcon className="text-white/70" />
                  <span>Ticket Availability </span>
                  <span className={isSoldOut ? "font-semibold text-[#FF2C55]" : "font-semibold text-white/100"}>
                    {section.availabilityText}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
