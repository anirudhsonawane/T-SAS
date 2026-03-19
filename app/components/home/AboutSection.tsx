"use client";

import { motion, type Variants } from "framer-motion";
import { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF2C55] shadow-[0_0_16px_rgba(255,44,85,0.75)]" />
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.45em] text-white/70">{text}</span>
    </div>
  );
}

function Equalizer({ active }: { active: boolean }) {
  const bars = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);
  const baseHeights = useMemo(
    () =>
      bars.map((index) => {
        const t = Math.sin((index / (bars.length - 1)) * Math.PI);
        return Math.round(10 + t * 18);
      }),
    [bars],
  );
  const baseScales = useMemo(() => baseHeights.map((h) => Math.max(0.25, Math.min(1, h / 32))), [baseHeights]);

  return (
    <div className="flex h-8 items-end gap-1" aria-hidden>
      {bars.map((index) => (
        <motion.span
          key={index}
          className="h-full w-1 origin-bottom rounded-full bg-white/70"
          animate={
            active
              ? { scaleY: [baseScales[index] ?? 0.4, 0.95, 0.5, 1, 0.4] }
              : { scaleY: baseScales[index] ?? 0.4 }
          }
          transition={
            active
              ? {
                  duration: 1.6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.05,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 8.2v7.6a.9.9 0 0 0 1.34.78l6.6-3.8a.9.9 0 0 0 0-1.56l-6.6-3.8A.9.9 0 0 0 10 8.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
} satisfies Variants;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75 } },
} satisfies Variants;

export function AboutSection() {
  const [liveHovered, setLiveHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section
      id="about"
      className="relative scroll-mt-28 bg-[#0B0B0B] px-4 py-16 text-white sm:px-6 md:py-20 lg:px-10 xl:px-14"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05, margin: "0px 0px -120px 0px" }}
        className="relative mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp}>
          <SectionLabel text="ABOUT" />
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="mx-auto mt-6 max-w-5xl text-balance text-center text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-tight"
        >
          Celebrate music’s power with iconic performances, dazzling visuals, and a one-night-only atmosphere designed
          to thrill and inspire every fan.
        </motion.h2>

        <motion.div variants={container} className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 md:gap-8">
          <motion.article
            variants={fadeUp}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            onHoverStart={() => setLiveHovered(true)}
            onHoverEnd={() => setLiveHovered(false)}
            className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-[0_18px_80px_rgba(0,0,0,0.55)] sm:p-8"
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-90 bg-[linear-gradient(135deg,rgba(255,44,85,0.55),rgba(138,43,226,0.35),rgba(255,0,85,0.3))]"
            />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.16),transparent_55%)]" />
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,44,85,0.38),transparent_60%)]"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">Performing Live</p>
                  <h3 className="text-2xl font-semibold leading-tight sm:text-3xl">The Sonic Waves</h3>
                </div>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/25 bg-white/10">
                  {/* Using existing image as a placeholder avatar */}
                  <img src="/bg-image.png" alt="Artist avatar" className="h-full w-full object-cover opacity-90" />
                </div>
              </div>

              <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/75 sm:text-base">
                The Sonic Waves bring electrifying energy to the stage with powerful rhythms and unforgettable live
                performances.
              </p>

              <div className="mt-6 flex items-center justify-between gap-4">
                <Equalizer active={isMobile || liveHovered} />
                <p className="text-xs font-semibold text-white/80 sm:text-sm">
                  Be part of the magic — join now before it&apos;s gone!
                </p>
              </div>
            </div>
          </motion.article>

          <motion.article
            variants={fadeUp}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_18px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="relative aspect-[16/11] w-full">
              <img
                src="/bg-image.png"
                alt="Cinematic concert preview"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.65))]"
              />
              <div
                aria-hidden
                className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_25%_25%,rgba(138,43,226,0.25),transparent_50%)]"
              />

              <motion.button
                type="button"
                aria-label="Play preview"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_60px_rgba(0,0,0,0.55)] transition group-hover:bg-white/15"
              >
                <PlayIcon />
              </motion.button>

              <button
                type="button"
                className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur transition hover:bg-black/45"
              >
                Unmute Video
              </button>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_0_0_1px_rgba(255,44,85,0.12),0_0_40px_rgba(255,44,85,0.16)]"
            />
          </motion.article>
        </motion.div>
      </motion.div>
    </section>
  );
}
