"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import type { VenueSection, VenueSectionId } from "./types";

function sectionGradient(accent: VenueSection["accent"]) {
  switch (accent) {
    case "purple":
      return "url(#gradPurple)";
    case "yellow":
      return "url(#gradYellow)";
    case "orange":
      return "url(#gradOrange)";
    case "red":
      return "url(#gradRed)";
    default:
      return "rgba(255,255,255,0.2)";
  }
}

export function VenueSeatMap({
  sections,
  onSelect,
}: {
  sections: VenueSection[];
  onSelect: (id: VenueSectionId) => void;
}) {
  const byId = useMemo(() => Object.fromEntries(sections.map((s) => [s.id, s])) as Record<VenueSectionId, VenueSection>, [
    sections,
  ]);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-x-auto"
      >
        <div className="min-w-[680px] sm:min-w-[820px] touch-pan-x">
          <svg viewBox="0 0 1000 620" className="h-auto w-full">
            <defs>
              <radialGradient id="gradPurple" cx="50%" cy="45%" r="70%">
                <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3b0b6b" stopOpacity="0.55" />
              </radialGradient>
              <radialGradient id="gradYellow" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#FFD24A" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#8a6a00" stopOpacity="0.55" />
              </radialGradient>
              <radialGradient id="gradOrange" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#FF8A1F" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#6b2a00" stopOpacity="0.55" />
              </radialGradient>
              <radialGradient id="gradRed" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#FF2C55" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#520018" stopOpacity="0.55" />
              </radialGradient>
            </defs>

            {/* Outer ring (Seating Area) */}
            <motion.path
              d="M130,520 A370,370 0 0,1 870,520 L840,520 A340,340 0 0,0 160,520 Z"
              fill={sectionGradient(byId.seating.accent)}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
              onClick={() => onSelect("seating")}
              className="cursor-pointer"
            />

            {/* Inner ring rows (visual detail) */}
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${180 + i * 22},520 A${320 - i * 22},${320 - i * 22} 0 0,1 ${820 - i * 22},520`}
                fill="none"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="2"
              />
            ))}

            {/* Festival Ground */}
            <motion.path
              d="M240,500 A260,260 0 0,1 760,500 L720,500 A220,220 0 0,0 280,500 Z"
              fill={sectionGradient(byId.festival.accent)}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              onClick={() => onSelect("festival")}
              className="cursor-pointer"
            />

            {/* VIP blocks */}
            <motion.path
              d="M150,420 Q210,340 310,310 L310,380 Q235,402 190,458 Z"
              fill={sectionGradient(byId.vip.accent)}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="2"
              onClick={() => onSelect("vip")}
              className="cursor-pointer"
            />
            <motion.path
              d="M850,420 Q790,340 690,310 L690,380 Q765,402 810,458 Z"
              fill={sectionGradient(byId.vip.accent)}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="2"
              onClick={() => onSelect("vip")}
              className="cursor-pointer"
            />

            {/* Stage */}
            <rect x="430" y="80" width="140" height="44" rx="12" fill="url(#gradPurple)" stroke="rgba(255,255,255,0.2)" />
            <text x="500" y="109" textAnchor="middle" fontSize="14" fill="white" fontWeight="700" letterSpacing="4">
              STAGE
            </text>

            {/* Premium boxes */}
            <motion.rect
              x="300"
              y="150"
              width="150"
              height="70"
              rx="18"
              fill={sectionGradient(byId.premium.accent)}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
              onClick={() => onSelect("premium")}
              className="cursor-pointer"
            />
            <motion.rect
              x="550"
              y="150"
              width="150"
              height="70"
              rx="18"
              fill={sectionGradient(byId.premium.accent)}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="2"
              onClick={() => onSelect("premium")}
              className="cursor-pointer"
            />
            <text x="375" y="192" textAnchor="middle" fontSize="12" fill="white" fontWeight="700" letterSpacing="1.5">
              Premium Box L
            </text>
            <text x="625" y="192" textAnchor="middle" fontSize="12" fill="white" fontWeight="700" letterSpacing="1.5">
              Premium Box R
            </text>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
