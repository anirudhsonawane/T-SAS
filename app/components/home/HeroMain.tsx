"use client";

import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";

import type { HeroContent } from "./types";
import { GetTicketsButton } from "./GetTicketsButton";

export function HeroMain({
  mainY,
  content,
  ctaHref = "#pricing",
}: {
  mainY: MotionValue<number>;
  content: HeroContent;
  ctaHref?: string;
}) {
  return (
    <motion.div
      style={{ y: mainY }}
      className="order-1 text-center md:col-span-2 lg:order-2 lg:col-span-1"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.25 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 55 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55 }}
        className="text-[clamp(2.7rem,9vw,6.4rem)] font-semibold leading-[0.95] tracking-tight drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
      >
        {content.titleTop}
        <span className="block">{content.titleBottom}</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.78 }}
        className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-lg"
      >
        {content.subtitle}
      </motion.p>

      <GetTicketsButton href={ctaHref} label={content.cta} />
    </motion.div>
  );
}
