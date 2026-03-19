"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.2 });

  return (
    <div aria-hidden className="scroll-progress-bar pointer-events-none fixed left-0 top-0 z-[60] h-[3px] w-full bg-white/10">
      <motion.div className="h-full origin-left bg-white" style={{ scaleX }} />
    </div>
  );
}
