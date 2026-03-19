"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

type Partner = {
  name: string;
  logo: ReactNode;
};

function LogoMark(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15 4L26 14L15 24L4 14L15 4Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M41 7.2H53.6C57.2 7.2 59.9 9.3 59.9 12.9C59.9 16.7 57.1 18.8 53.3 18.8H48.1V22.7H41V7.2ZM48.1 11V15H52.2C53.6 15 54.5 14.2 54.5 13C54.5 11.7 53.6 11 52.2 11H48.1Z"
        fill="currentColor"
      />
      <path
        d="M68.1 22.7V7.2H75.2V18.7H86.6V22.7H68.1Z"
        fill="currentColor"
      />
      <path
        d="M96.8 7.2H104.7L115.6 22.7H108.3L106.6 20.2H95L93.4 22.7H86L96.8 7.2ZM97.6 16.6H104L100.8 11.6L97.6 16.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WaveMark(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 19.5C16 8.5 24 8.5 32 19.5C40 30.5 48 30.5 56 19.5C64 8.5 72 8.5 80 19.5C88 30.5 96 30.5 104 19.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M18 8.2H24.4C26.4 8.2 27.9 9.4 27.9 11.5C27.9 13.6 26.4 14.8 24.3 14.8H21V18.9H18V8.2ZM21 10.6V12.4H24C24.7 12.4 25.1 12 25.1 11.5C25.1 11 24.7 10.6 24 10.6H21Z"
        fill="currentColor"
      />
      <path d="M34 8.2H37V18.9H34V8.2Z" fill="currentColor" />
      <path
        d="M43 18.9V8.2H46.1L52.3 14.7V8.2H55.3V18.9H52.3L46 12.4V18.9H43Z"
        fill="currentColor"
      />
      <path
        d="M61 18.9V8.2H64V14.7L70.1 8.2H73.8L67.4 14.8L74.2 18.9H70.2L64.7 15.4L64 16.1V18.9H61Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HexMark(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16 4.8L25.8 10.4V21.6L16 27.2L6.2 21.6V10.4L16 4.8Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M41 8.2H48.9C52.3 8.2 54.7 10.2 54.7 13.5C54.7 16.8 52.3 18.9 48.9 18.9H44V22.7H41V8.2ZM44 10.8V16.3H48.6C50.4 16.3 51.7 15.2 51.7 13.5C51.7 11.9 50.4 10.8 48.6 10.8H44Z"
        fill="currentColor"
      />
      <path
        d="M60.2 22.7V8.2H63.2V18.9H73.4V22.7H60.2Z"
        fill="currentColor"
      />
      <path
        d="M78.1 22.7V8.2H92.1V10.8H81.1V14H90.1V16.6H81.1V20H92.4V22.7H78.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PulseMark(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8 16H22L27 8L34 22L39 14H52"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M62 22.7V8.2H69.8C73.2 8.2 75.6 10.2 75.6 13.5C75.6 16.8 73.2 18.9 69.8 18.9H65V22.7H62ZM65 10.8V16.3H69.6C71.4 16.3 72.7 15.2 72.7 13.5C72.7 11.9 71.4 10.8 69.6 10.8H65Z"
        fill="currentColor"
      />
      <path
        d="M80.7 22.7V8.2H83.7V22.7H80.7Z"
        fill="currentColor"
      />
      <path
        d="M89.4 22.7V8.2H92.4V14.2H100.3V8.2H103.3V22.7H100.3V16.8H92.4V22.7H89.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function OrbitMark(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M18 14C18 18.4 14.4 22 10 22C5.6 22 2 18.4 2 14C2 9.6 5.6 6 10 6C14.4 6 18 9.6 18 14Z"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="M10 14C17 9 25 8 34 11.2"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M10 14C17 19 25 20 34 16.8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M46 8.2H60V10.8H49V14H58.1V16.6H49V22.7H46V8.2Z"
        fill="currentColor"
      />
      <path
        d="M65.2 22.7V8.2H75.8C78.8 8.2 80.9 9.9 80.9 12.5C80.9 14.4 79.9 15.8 78.3 16.5L82.1 22.7H78.6L75.3 17.2H68.2V22.7H65.2ZM68.2 10.8V14.7H75.3C77 14.7 77.9 13.9 77.9 12.7C77.9 11.5 77 10.8 75.3 10.8H68.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PartnerCell({ partner }: { partner: Partner }) {
  return (
    <div className="group relative flex items-center justify-center px-6 py-7 transition duration-200 ease-out hover:z-10 hover:scale-[1.015] hover:bg-white/[0.03]">
      <div className="flex items-center justify-center transition duration-200 ease-out group-hover:scale-105">
        <span className="sr-only">{partner.name}</span>
        {partner.logo}
      </div>
    </div>
  );
}

const partners: Partner[] = [
  {
    name: "Logoipsum",
    logo: <LogoMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Wave Studio",
    logo: <WaveMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Hex Audio",
    logo: <HexMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Pulse Media",
    logo: <PulseMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Orbit Live",
    logo: <OrbitMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Logoipsum One",
    logo: <HexMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Logoipsum Two",
    logo: <PulseMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Logoipsum Three",
    logo: <OrbitMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Logoipsum Four",
    logo: <WaveMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
  {
    name: "Logoipsum Five",
    logo: <LogoMark className="h-7 w-auto text-white/55 transition duration-200 group-hover:text-white" />,
  },
];

export function PartnersSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id="partners"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative scroll-mt-28 overflow-hidden bg-[#0B0B0B] px-4 py-24 text-white sm:px-6 sm:py-28 lg:px-10 xl:px-14"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/65">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#FF3B3B]" />
          <span>Partnership</span>
        </div>

        <h2 className="mt-6 text-center text-[clamp(1.85rem,5.2vw,3.25rem)] font-semibold tracking-tight text-white">
          Our Partners in <span className="text-[#FF3B3B]">Music Experiences</span>
        </h2>

        <div className="mt-12 rounded-2xl border border-[#1A1A1A] bg-white/[0.02] shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
          <div className="rounded-2xl bg-[#1A1A1A] p-px">
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[calc(theme(borderRadius.2xl)-1px)] bg-[#1A1A1A] min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((partner) => (
                <div key={partner.name} className="bg-[#0B0B0B]">
                  <PartnerCell partner={partner} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
