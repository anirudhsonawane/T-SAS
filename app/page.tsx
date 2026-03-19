"use client";

import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { authNavLinks, eventInfo, heroContent, navLinks } from "./components/home/content";
import { AboutSection } from "./components/home/AboutSection";
import { EventDetailsCard } from "./components/home/EventDetailsCard";
import { HeroMain } from "./components/home/HeroMain";
import { Navbar } from "./components/home/Navbar";
import { PreviewCard } from "./components/home/PreviewCard";
import { VenueSection } from "./components/home/VenueSection";
import { PartnersSection } from "./components/partners/PartnersSection";
import { TicketsPricing } from "./components/tickets/TicketsPricing";
import { ScrollSectionDots } from "./components/ScrollSectionDots";
import { Footer } from "./components/Footer";

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const mainY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -90]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -48]);
  const eventY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -65]);

  return (
    <main className="flex min-h-dvh flex-col overflow-x-clip bg-[#0b0206] text-white">
      <section id="top" aria-hidden className="h-0 scroll-mt-24" />
        <ScrollSectionDots
          sections={[
            { id: "top", label: "Home" },
            { id: "about", label: "About" },
            { id: "venue", label: "Venue" },
            { id: "partners", label: "Partners" },
            { id: "pricing", label: "Pricing" },
            { id: "contact", label: "Contact" },
          ]}
        />
      <section
        ref={heroRef}
        className="relative isolate min-h-dvh overflow-hidden px-4 pb-10 pt-5 sm:px-6 lg:px-10 xl:px-14"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg-image.png')" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,95,130,0.45),transparent_55%)]"
        />
        <div aria-hidden className="absolute inset-0 bg-[rgba(0,0,0,0.42)]" />

        <Navbar links={navLinks} unauthenticatedLinks={authNavLinks} brand="Shub>Innovation" />

        <div className="relative z-10 mx-auto mt-8 grid w-full max-w-7xl items-center gap-8 pb-4 pt-2 md:grid-cols-2 lg:min-h-[calc(100dvh-9rem)] lg:grid-cols-[minmax(220px,260px)_1fr_minmax(240px,280px)]">
          <PreviewCard videoY={videoY} previewLabel={heroContent.previewLabel} imageUrl="/bg-image.png" />
          <HeroMain mainY={mainY} content={heroContent} ctaHref="#pricing" />
          <EventDetailsCard eventY={eventY} items={eventInfo} title="Event Details" />
        </div>
      </section>

      <AboutSection />
      <VenueSection />
      <PartnersSection />
      <section className="relative bg-[#0B0B0B] text-white">
        <div className="relative">
          <TicketsPricing sectionId="pricing" />
        </div>
      </section>
      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
}
