"use client";

import { useMemo } from "react";

import { Navbar } from "@/app/components/home/Navbar";
import { authNavLinks, navLinks } from "@/app/components/home/content";
import { TicketsPricing } from "@/app/components/tickets/TicketsPricing";
import { Footer } from "@/app/components/Footer";

export default function TicketsPage() {
  const routeLinks = useMemo(
    () =>
      navLinks.map((link) => {
        if (!link.href.startsWith("#")) return link;
        // On /pricing, keep Pricing in-page (shows ticket cards), but send other sections to home.
        if (link.href === "#pricing") return link;
        return { ...link, href: `/${link.href}` };
      }),
    [],
  );

  return (
    <main className="flex min-h-dvh flex-col bg-[#0B0B0B] text-white">
      <Navbar links={routeLinks} unauthenticatedLinks={authNavLinks} brand="Shub>Innovation" />
      <TicketsPricing sectionId="pricing" />
      <div className="mt-auto">
        <Footer id="pricing-footer" />
      </div>
    </main>
  );
}
