"use client";

import { motion } from "framer-motion";

export function GetTicketsButton({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 1.05,
        type: "spring",
        stiffness: 320,
        damping: 16,
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black shadow-[0_0_0_rgba(255,44,85,0.5)] transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(255,44,85,0.7)]"
    >
      <span>{label}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff2c55] text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
          <path d="M4 12h11.5L11 7.5 12.4 6 19 12l-6.6 6-1.4-1.5 4.5-4.5H4z" />
        </svg>
      </span>
    </motion.a>
  );
}

