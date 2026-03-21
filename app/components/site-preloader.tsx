"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_MS = 900;
const MAX_VISIBLE_MS = 3200;

export default function SitePreloader() {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const startTimeRef = useRef(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = performance.now();

    let hideTimeout: ReturnType<typeof setTimeout> | undefined;

    const finishPreloader = () => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      hideTimeout = setTimeout(() => setIsVisible(false), remaining);
    };

    if (document.readyState === "complete") {
      finishPreloader();
    } else {
      window.addEventListener("load", finishPreloader, { once: true });
    }

    const fallbackTimeout = setTimeout(finishPreloader, MAX_VISIBLE_MS);

    return () => {
      window.removeEventListener("load", finishPreloader);
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center gap-5 px-5 text-center">
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : { y: [0, -8, 0], rotate: [0, -2.5, 2.5, 0], scale: [1, 1.03, 1] }
              }
              transition={{
                duration: 1.9,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <svg
                width="156"
                height="92"
                viewBox="0 0 156 92"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <linearGradient id="ticketGradient" x1="0" y1="0" x2="156" y2="92">
                    <stop offset="0%" stopColor="#ff2c55" />
                    <stop offset="100%" stopColor="#ff0055" />
                  </linearGradient>
                </defs>
                <path
                  d="M16 18C16 25 10 31 3 31V61C10 61 16 67 16 74H140C140 67 146 61 153 61V31C146 31 140 25 140 18H16Z"
                  fill="url(#ticketGradient)"
                />
                <path d="M60 22V70" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="39" cy="46" r="9" fill="white" fillOpacity="0.24" />
                <circle cx="117" cy="46" r="9" fill="white" fillOpacity="0.24" />
                <path d="M75 36H126" stroke="white" strokeOpacity="0.9" strokeWidth="3" />
                <path d="M75 46H112" stroke="white" strokeOpacity="0.8" strokeWidth="3" />
                <path d="M75 56H121" stroke="white" strokeOpacity="0.7" strokeWidth="3" />
              </svg>
            </motion.div>

            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#201014]">TICKETr</p>

            <div className="flex items-center gap-2" aria-hidden>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-[#ff2c55]"
                  animate={prefersReducedMotion ? undefined : { opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: dot * 0.12,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
