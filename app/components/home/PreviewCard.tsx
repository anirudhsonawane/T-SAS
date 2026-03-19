"use client";

import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";

export function PreviewCard({
  videoY,
  previewLabel,
  imageUrl = "/bg-image.png",
}: {
  videoY: MotionValue<number>;
  previewLabel: string;
  imageUrl?: string;
}) {
  return (
    <motion.div
      style={{ y: videoY }}
      initial={{ opacity: 0, x: -35 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.45 }}
      className="order-2 mx-auto w-full max-w-[340px] md:mx-0 lg:order-1 lg:self-start lg:pt-16"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/35 bg-black/25 shadow-[0_15px_45px_rgba(0,0,0,0.45)] backdrop-blur-sm">
        <div className="aspect-video w-full bg-cover bg-center" style={{ backgroundImage: `url('${imageUrl}')` }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.7))]" />
        <button
          type="button"
          aria-label="Play video preview"
          className="group absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/45 bg-white/10 backdrop-blur transition duration-300 hover:scale-105 hover:bg-white/25"
        >
          <svg
            viewBox="0 0 24 24"
            className="ml-0.5 h-6 w-6 fill-white transition group-hover:fill-[#ff2c55]"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
      <p className="mt-3 text-center text-sm uppercase tracking-[0.2em] text-white/70 lg:text-left">
        {previewLabel}
      </p>
    </motion.div>
  );
}

