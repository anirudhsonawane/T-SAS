import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import SitePreloader from "./components/site-preloader";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { Providers } from "./providers";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "QUICKETS | Event Ticket Marketplace",
  description: "Cinematic concert ticket marketplace landing page.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <SitePreloader />
          <ScrollToTopButton />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
