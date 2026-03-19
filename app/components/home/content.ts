import type { EventInfo, HeroContent, NavLink } from "./types";

export const heroContent: HeroContent = {
  titleTop: "The True Magic of",
  titleBottom: "Eternal Beats",
  subtitle:
    "Join thousands of fans for a night of electrifying music, dazzling lights, and unforgettable performances.",
  cta: "Get Tickets",
  previewLabel: "Festival Preview",
};

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Venue", href: "#venue" },
  { label: "Pricing", href: "#pricing" },
  { label: "Ticket Wallet", href: "/ticket-wallet" },
  { label: "Contact", href: "#contact" },
];

export const authNavLinks: NavLink[] = [
  { label: "Login", href: "/login" },
  { label: "Signup", href: "/signup" },
];

export const eventInfo: EventInfo[] = [
  { label: "Date", value: "15 July 2035" },
  { label: "Time", value: "8PM - 12PM" },
  { label: "Location", value: "Jakarta, Indonesia" },
];
