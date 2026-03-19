import Link from "next/link";

const footerLinks = [
  { label: "About", href: "/#about" },
  { label: "Venue", href: "/#venue" },
  { label: "Pricing", href: "/tickets" },
] as const;

export function Footer({ id = "contact" }: { id?: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id={id} className="scroll-mt-24 bg-[#0B0B0B] text-white">
      <div className="mx-auto w-full max-w-6xl border-t border-[#1A1A1A] px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-white/90">
              TICKETr - Powered by, SHUB.innovation
            </div>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
              Premium concert ticket marketplace for unforgettable nights.
            </p>
          </div>

          <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#1A1A1A] pt-6 text-center text-xs text-white/55 md:flex-row md:text-left">
          <div>
          {"\u00A9"} {currentYear} TICKETr - Powered by, SHUB.innovation. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B3B]" aria-hidden />
            <span>Partnerships: sponsors@quickets.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
