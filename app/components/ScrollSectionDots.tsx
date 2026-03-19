"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

type SectionLink = { id: string; label: string };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashStringToSeed(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 10h18v2H3v-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 10v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M7.5 10c-1.9 0-3.5-1.3-3.5-3 0-1.4 1.1-2.5 2.6-2.5 2.2 0 3.4 2 4.4 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 10c1.9 0 3.5-1.3 3.5-3 0-1.4-1.1-2.5-2.6-2.5-2.2 0-3.4 2-4.4 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const CONFETTI_PIECES = [
  // Curved ribbons (streamers)
  { kind: "ribbon", dx: -20, dy: -16, r: -35, d: 0.0, c: "#FFD24A", o: 0.95 },
  { kind: "ribbon", dx: 18, dy: -14, r: 30, d: 0.04, c: "#4FD1FF", o: 0.9 },
  { kind: "ribbon", dx: -8, dy: -18, r: -18, d: 0.08, c: "#FF2C55", o: 0.9 },

  // Curly streamers (little squiggles)
  { kind: "curly", dx: -10, dy: -12, r: -35, d: 0.02, c: "#FFFFFF", o: 0.8 },
  { kind: "curly", dx: 10, dy: -11, r: 30, d: 0.05, c: "#FF2C55", o: 0.95 },
  { kind: "curly", dx: -18, dy: -2, r: -10, d: 0.09, c: "#8A2BE2", o: 0.9 },
  { kind: "curly", dx: 18, dy: -4, r: 12, d: 0.12, c: "#FFD24A", o: 0.95 },

  // Confetti dots (no stripes)
  { kind: "dot", dx: -18, dy: -10, r: 20, d: 0.0, c: "#FF2C55", s: 4, o: 0.95 },
  { kind: "dot", dx: 16, dy: -10, r: -18, d: 0.03, c: "#FFFFFF", s: 3, o: 0.8 },
  { kind: "dot", dx: -22, dy: -4, r: 30, d: 0.06, c: "#8A2BE2", s: 3, o: 0.9 },
  { kind: "dot", dx: 22, dy: -5, r: -25, d: 0.09, c: "#FFD24A", s: 3, o: 0.95 },
  { kind: "dot", dx: -10, dy: 7, r: 15, d: 0.12, c: "#FFFFFF", s: 2.5, o: 0.7 },
  { kind: "dot", dx: 12, dy: 8, r: -12, d: 0.15, c: "#FF2C55", s: 2.5, o: 0.85 },
] as const;

function ConfettiBurst() {
  const pieces = CONFETTI_PIECES;
  const burstId = useId();

  const ribbonPathByKey = useMemo(() => {
    const rng = mulberry32(hashStringToSeed(burstId));
    const rand = (min: number, max: number) => min + rng() * (max - min);
    const f = (n: number) => Number(n.toFixed(1));

    const makePath = () => {
      const startX = 10;
      const endX = 54;
      const baseY = 44;
      const y = f(baseY + rand(-1.5, 1.5));

      const mid1x = f(rand(22, 28));
      const mid2x = f(rand(36, 42));

      const c1x = f(startX + rand(6, 12));
      const c2x = f(mid1x - rand(7, 12));
      const c3x = f(mid2x - rand(7, 12));
      const c4x = f(endX - rand(7, 12));

      const up1 = f(y - rand(12, 20));
      const down1 = f(y + rand(10, 18));
      const up2 = f(y - rand(10, 18));
      const down2 = f(y + rand(10, 18));

      return `M${startX} ${y} C${c1x} ${up1} ${c2x} ${down1} ${mid1x} ${y} S${c3x} ${up2} ${mid2x} ${y} S${c4x} ${down2} ${endX} ${y}`;
    };

    const map = new Map<string, string>();
    for (const p of pieces) {
      if (p.kind !== "ribbon") continue;
      const key = `${p.kind}:${p.dx},${p.dy},${p.d}`;
      map.set(key, makePath());
    }
    return map;
  }, [burstId, pieces]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {pieces.map((p) => {
        const key = `${p.kind}:${p.dx},${p.dy},${p.d}`;

        if (p.kind === "ribbon") {
          const d = ribbonPathByKey.get(key) ?? "M10 44c10-18 18 18 28 0s18 18 16 8";
          return (
            <motion.svg
              key={key}
              viewBox="0 0 64 64"
              className="absolute -bottom-2 left-1/2 h-7 w-7 -translate-x-1/2"
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.85 }}
              animate={{
                x: p.dx,
                y: [0, p.dy, p.dy + 16],
                opacity: [p.o ?? 1, p.o ?? 1, 0],
                rotate: p.r,
                scale: 1,
              }}
              transition={{ duration: 1.6, ease: "easeOut", delay: p.d, times: [0, 0.45, 1] }}
              aria-hidden
            >
              <path
                d={d}
                fill="none"
                stroke={p.c}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={p.o ?? 1}
              />
            </motion.svg>
          );
        }

        if (p.kind === "curly") {
          return (
            <motion.svg
              key={key}
              viewBox="0 0 24 24"
              className="absolute -bottom-2 left-1/2 h-5 w-5 -translate-x-1/2"
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.9 }}
              animate={{
                x: p.dx,
                y: [0, p.dy, p.dy + 12],
                opacity: [1, 1, 0],
                rotate: p.r,
                scale: 1,
              }}
              transition={{ duration: 1.4, ease: "easeOut", delay: p.d, times: [0, 0.45, 1] }}
              aria-hidden
            >
              <path
                d="M2 6c4-4 8 4 12 0s8 4 8 4"
                fill="none"
                stroke={p.c}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={p.o ?? 1}
              />
              <path
                d="M2 14c4-4 8 4 12 0s8 4 8 4"
                fill="none"
                stroke={p.c}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={(p.o ?? 1) * 0.9}
              />
            </motion.svg>
          );
        }

        const opacity = "o" in p ? p.o : 1;
        const size = "s" in p ? p.s : 3;

        return (
          <motion.span
            key={key}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: p.c, width: `${size}px`, height: `${size}px`, opacity }}
            initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
            animate={{
              x: p.dx,
              y: [0, p.dy, p.dy + 18],
              opacity: [opacity, opacity, 0],
              rotate: p.r,
              scale: [1, 1.05, 0.9],
            }}
            transition={{
              duration: 1.4,
              ease: "easeOut",
              delay: p.d,
              times: [0, 0.45, 1],
            }}
          />
        );
      })}
    </div>
  );
}

export function ScrollSectionDots({
  sections,
  offset = 120,
}: {
  sections: SectionLink[];
  offset?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [tops, setTops] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [giftUnlocked, setGiftUnlocked] = useState(false);

  const progressRaw = useMotionValue(0);
  const progress = useSpring(progressRaw, { stiffness: 220, damping: 30, mass: 0.18 });

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    const compute = () => {
      const next = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return Number.POSITIVE_INFINITY;
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY;
      });
      setTops(next);
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [ids]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!tops.length) return;
    const anchor = Math.round(window.innerHeight * 0.85);
    const cursor = latest + anchor + offset;

    const nextStarted = latest > 10;
    setStarted((prev) => (prev === nextStarted ? prev : nextStarted));

    let idx = 0;
    for (let i = 0; i < tops.length; i += 1) {
      if (cursor >= (tops[i] ?? Number.POSITIVE_INFINITY)) idx = i;
    }

    const nextActive = clamp(idx, 0, tops.length - 1);
    setActiveIndex((prev) => (prev === nextActive ? prev : nextActive));

    const firstTop = tops[0] ?? 0;
    const lastTop = tops[tops.length - 1] ?? firstTop;
    const nextProgress = lastTop > firstTop ? clamp((cursor - firstTop) / (lastTop - firstTop), 0, 1) : 0;
    progressRaw.set(nextProgress);

    const nextGiftUnlocked = nextProgress >= 0.995;
    setGiftUnlocked((prev) => (prev === nextGiftUnlocked ? prev : nextGiftUnlocked));
  });

  if (!sections.length) return null;

  const reachedLast = giftUnlocked;

  return (
    <nav
      aria-label="Scroll progress"
      className="scroll-section-dots fixed left-0 top-1/2 z-50 -translate-y-1/2"
    >
      <div aria-hidden className="relative flex flex-col items-center">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
        <motion.div
          className="absolute left-1/2 top-0 h-full w-px origin-top -translate-x-1/2 bg-white/70"
          style={{ scaleY: prefersReducedMotion ? progressRaw : progress }}
        />

        <div className="flex flex-col items-center gap-3">
          {sections.map((section, idx) => {
            const isActive = idx === activeIndex;
            const isLast = idx === sections.length - 1;
            const showGift = isLast && reachedLast;
            const showCheck = started && idx <= activeIndex && !showGift;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-label={section.label}
                className="group relative flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8"
              >
                <span
                  className={[
                    "absolute h-[18px] w-[18px] rounded-full border transition sm:h-5 sm:w-5",
                    isActive
                      ? "border-white bg-white"
                      : showGift
                        ? "border-white bg-white"
                        : showCheck
                        ? "border-white/80 bg-white/70"
                        : "border-white/35 bg-black/20",
                    "group-hover:border-white group-hover:bg-white/60",
                  ].join(" ")}
                />
                {showGift ? (
                  <span className="relative z-10 text-black">
                    <AnimatePresence>
                      {giftUnlocked ? (
                        <motion.span
                          key="gift"
                          className="relative inline-flex"
                          initial={{ scale: 0.85, rotate: -12, y: 1 }}
                          animate={{ scale: 1, rotate: 0, y: 0 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 320, damping: 18 }}
                        >
                          <GiftIcon />
                          {prefersReducedMotion ? null : <ConfettiBurst />}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </span>
                ) : showCheck ? (
                  <span className="relative z-10 text-black">
                    <CheckIcon />
                  </span>
                ) : null}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
