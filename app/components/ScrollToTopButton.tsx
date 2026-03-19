"use client";

import { useEffect, useState } from "react";

function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5l-7 7 1.4 1.4L11 8.8V20h2V8.8l4.6 4.6L19 12l-7-7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ScrollToTopButton({ threshold = 420 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > threshold);
    update();

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/40 text-white/90 backdrop-blur transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <ArrowUpIcon />
    </button>
  );
}

