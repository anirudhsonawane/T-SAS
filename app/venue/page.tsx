"use client";

import { motion, type Variants } from "framer-motion";
import { useMemo, useState } from "react";

import { Navbar } from "@/app/components/home/Navbar";
import { authNavLinks, navLinks } from "@/app/components/home/content";
import { TicketsPricing } from "@/app/components/tickets/TicketsPricing";
import { TicketLegend } from "@/app/components/venue/TicketLegend";
import { TicketSelectionModal } from "@/app/components/venue/TicketSelectionModal";
import type { VenueSection, VenueSectionId } from "@/app/components/venue/types";
import { VenueSeatMap } from "@/app/components/venue/VenueSeatMap";

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF2C55] shadow-[0_0_16px_rgba(255,44,85,0.75)]" />
      <span className="text-xs font-semibold uppercase tracking-[0.45em] text-white/70">{text}</span>
    </div>
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

export default function VenuePage() {
  const routeLinks = useMemo(
    () =>
      navLinks.map((link) => {
        if (!link.href.startsWith("#")) return link;
        // Keep Pricing in-page (this page includes ticket cards), but send other sections to home.
        if (link.href === "#pricing") return link;
        return { ...link, href: `/${link.href}` };
      }),
    [],
  );

  const sections = useMemo<VenueSection[]>(
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

  const byId = useMemo(() => Object.fromEntries(sections.map((s) => [s.id, s])) as Record<VenueSectionId, VenueSection>, [
    sections,
  ]);

  const [selectedId, setSelectedId] = useState<VenueSectionId | null>(null);
  const selectedSection = selectedId ? byId[selectedId] : null;

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="relative min-h-dvh overflow-x-clip bg-[#0B0B0B] text-white">
      <Navbar links={routeLinks} unauthenticatedLinks={authNavLinks} brand="Shub>Innovation" />
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 md:pb-20 lg:px-10 xl:px-14"
      >
        <motion.div variants={fadeUp} className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <SectionLabel text="VENUE" />
            <h1 className="text-balance text-[clamp(2.1rem,4.4vw,3.6rem)] font-semibold leading-tight">
              Venues That <span className="text-[#FF2C55]">Define the Vibe</span>
            </h1>
          </div>
          <p className="max-w-xl text-pretty text-sm leading-relaxed text-white/70 md:text-right sm:text-base">
            Secure your spot in the city&apos;s premier concert arena with diverse seating options.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 md:mt-12">
          <VenueSeatMap
            sections={sections}
            onSelect={(id) => {
              setSelectedId(id);
              setModalOpen(true);
            }}
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 md:mt-12">
          <TicketLegend sections={sections} />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 md:mt-12">
          <TicketsPricing sectionId="pricing" embedded />
        </motion.div>
      </motion.section>

      <TicketSelectionModal
        open={modalOpen}
        section={selectedSection}
        onClose={() => {
          setModalOpen(false);
          setSelectedId(null);
        }}
      />
    </main>
  );
}
