"use client";

import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";

import type { EventInfo } from "./types";

function EventInfoRow({ label, value }: EventInfo) {
  return (
    <div className="border-b border-white/15 pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs uppercase tracking-[0.24em] text-white/65">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white sm:text-xl">{value}</p>
    </div>
  );
}

export function EventDetailsCard({
  eventY,
  items,
  title = "Event Details",
}: {
  eventY: MotionValue<number>;
  items: EventInfo[];
  title?: string;
}) {
  return (
    <motion.aside
      style={{ y: eventY }}
      initial={{ opacity: 0, x: 35 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.6 }}
      className="order-3 mx-auto w-full max-w-[360px] rounded-3xl border border-white/30 bg-black/30 p-6 backdrop-blur-md md:mx-0 md:justify-self-end lg:mx-0 lg:max-w-[280px] lg:justify-self-end"
    >
      <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/70">{title}</p>
      <div className="space-y-4">
        {items.map((item) => (
          <EventInfoRow key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </motion.aside>
  );
}

