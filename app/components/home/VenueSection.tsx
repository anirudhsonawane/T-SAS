"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

import { TicketLegend } from "@/app/components/venue/TicketLegend";
import { TicketSelectionModal } from "@/app/components/venue/TicketSelectionModal";
import type { VenueSection as VenueSectionType, VenueSectionId } from "@/app/components/venue/types";

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF2C55] shadow-[0_0_16px_rgba(255,44,85,0.75)]" />
      <span className="text-xs font-semibold uppercase tracking-[0.45em] text-white/70">{text}</span>
    </div>
  );
}

function Hotspot({
  id,
  label,
  rect,
  onSelect,
  onHover,
  onLeave,
}: {
  id: VenueSectionId;
  label: string;
  rect: { left: number; top: number; width: number; height: number };
  onSelect: (id: VenueSectionId) => void;
  onHover: (payload: { label: string; x: number; y: number }) => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => onSelect(id)}
      onPointerMove={(e) => {
        void e;
        void label;
        // Tooltips disabled (no hover effects).
      }}
      onPointerLeave={onLeave}
      className="absolute cursor-pointer rounded-2xl border border-transparent bg-transparent focus:outline-none focus:ring-2 focus:ring-white/20"
      style={{
        left: `${rect.left}%`,
        top: `${rect.top}%`,
        width: `${rect.width}%`,
        height: `${rect.height}%`,
      }}
    />
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
} satisfies Variants;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
} satisfies Variants;

export function VenueSection() {
  const sections = useMemo<VenueSectionType[]>(
    () => [
      {
        id: "seating",
        label: "Seating Area",
        colorName: "Purple",
        price: 80,
        availabilityText: "150 tickets left",
        status: "available",
        accent: "purple",
      },
      {
        id: "festival",
        label: "Festival Ground",
        colorName: "Yellow",
        price: 65,
        availabilityText: "300 tickets left",
        status: "available",
        accent: "yellow",
      },
      {
        id: "vip",
        label: "VIP Section",
        colorName: "Orange",
        price: 145,
        availabilityText: "SOLD OUT",
        status: "sold_out",
        accent: "orange",
      },
      {
        id: "premium",
        label: "Premium Box",
        colorName: "Red",
        price: 250,
        availabilityText: "20 tickets left",
        status: "available",
        accent: "red",
      },
    ],
    [],
  );

  const byId = useMemo(
    () => Object.fromEntries(sections.map((s) => [s.id, s])) as Record<VenueSectionId, VenueSectionType>,
    [sections],
  );

  const [selectedId, setSelectedId] = useState<VenueSectionId | null>(null);
  const selectedSection = selectedId ? byId[selectedId] : null;

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
      id="venue"
      className="relative scroll-mt-28 bg-[#0B0B0B] px-4 py-16 text-white sm:px-6 md:py-20 lg:px-10 xl:px-14"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mx-auto w-full max-w-6xl"
      >
        <motion.div variants={fadeUp} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <SectionLabel text="VENUE" />
            <h2 className="text-balance text-[clamp(2.1rem,4.4vw,3.2rem)] font-semibold leading-tight">
              Venues That <span className="text-[#FF2C55]">Define the Vibe</span>
            </h2>
          </div>
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-white/70 md:text-right sm:text-base">
            Secure your spot in the city&apos;s premier concert arena with diverse seating options.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 md:mt-12">
          <div className="relative overflow-hidden md:overflow-x-auto">
            <div className="relative mx-auto w-full max-w-5xl md:min-w-[860px]">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/venue-map.png"
                  alt="Venue seating map"
                  fill
                  sizes="(max-width: 768px) 100vw, 1000px"
                  className="object-contain"
                  priority={false}
                />

                {/* Hotspots (approximate placement for the provided map image) */}
                <Hotspot
                  id="festival"
                  label="Festival Ground"
                  rect={{ left: 33, top: 42, width: 34, height: 26 }}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setModalOpen(true);
                  }}
                  onHover={() => {}}
                  onLeave={() => {}}
                />
                <Hotspot
                  id="seating"
                  label="Seating Area"
                  rect={{ left: 12, top: 52, width: 76, height: 42 }}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setModalOpen(true);
                  }}
                  onHover={() => {}}
                  onLeave={() => {}}
                />
                <Hotspot
                  id="vip"
                  label="VIP Section"
                  rect={{ left: 7, top: 40, width: 18, height: 12 }}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setModalOpen(true);
                  }}
                  onHover={() => {}}
                  onLeave={() => {}}
                />
                <Hotspot
                  id="vip"
                  label="VIP Section"
                  rect={{ left: 75, top: 40, width: 18, height: 12 }}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setModalOpen(true);
                  }}
                  onHover={() => {}}
                  onLeave={() => {}}
                />
                <Hotspot
                  id="premium"
                  label="Premium Box"
                  rect={{ left: 39, top: 27, width: 10, height: 12 }}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setModalOpen(true);
                  }}
                  onHover={() => {}}
                  onLeave={() => {}}
                />
                <Hotspot
                  id="premium"
                  label="Premium Box"
                  rect={{ left: 51, top: 27, width: 10, height: 12 }}
                  onSelect={(id) => {
                    setSelectedId(id);
                    setModalOpen(true);
                  }}
                  onHover={() => {}}
                  onLeave={() => {}}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 md:mt-12">
          <TicketLegend sections={sections} />
        </motion.div>
      </motion.div>

      <TicketSelectionModal
        open={modalOpen}
        section={selectedSection}
        onClose={() => {
          setModalOpen(false);
          setSelectedId(null);
        }}
      />
    </section>
  );
}
