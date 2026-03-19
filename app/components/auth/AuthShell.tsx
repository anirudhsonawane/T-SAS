import { Navbar } from "@/app/components/home/Navbar";
import { authNavLinks, navLinks } from "@/app/components/home/content";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const routeLinks = navLinks.map((link) => (link.href.startsWith("#") ? { ...link, href: `/${link.href}` } : link));

  return (
    <main className="min-h-dvh overflow-x-clip bg-[#0b0206] text-white">
      <section className="relative isolate min-h-dvh overflow-hidden px-4 pb-10 pt-5 sm:px-6 lg:px-10 xl:px-14">
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

        <Navbar links={routeLinks} unauthenticatedLinks={authNavLinks} brand="QUICKETS" />

        <div className="relative z-10 mx-auto mt-10 flex w-full max-w-6xl justify-center lg:mt-16">
          <div className="w-full max-w-md">
            {title || subtitle ? (
              <div className="mb-6 text-center">
                {title ? <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1> : null}
                {subtitle ? (
                  <p className="mx-auto mt-3 max-w-sm text-pretty text-sm leading-relaxed text-white/75 sm:text-base">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
