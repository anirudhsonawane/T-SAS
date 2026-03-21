"use client";

import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState, type MouseEvent } from "react";

import type { NavLink } from "./types";

const PILL_CTA_CLASSNAME =
  "inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const AUTH_TEXT_LINK_CLASSNAME =
  "text-xs uppercase tracking-[0.2em] text-white/85 transition duration-300 hover:text-white hover:[text-shadow:0_0_14px_rgba(255,255,255,0.95)]";

function readStoredTicketId() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem("latestTicket") ?? window.localStorage.getItem("latestTicket");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ticketId?: unknown } | null;
    const ticketId = typeof parsed?.ticketId === "string" ? parsed.ticketId : null;
    return ticketId && ticketId.trim() ? ticketId : null;
  } catch {
    return null;
  }
}

function navToTicketWallet() {
  const ticketId = readStoredTicketId();
  const href = ticketId ? `/ticket-wallet?ticketId=${encodeURIComponent(ticketId)}` : "/ticket-wallet";
  window.location.assign(href);
}

function trySmoothScroll(href: string) {
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(href, window.location.origin);
    if (url.pathname !== window.location.pathname) return false;
    const hash = url.hash?.slice(1);
    if (!hash) return false;
    const target = document.getElementById(hash);
    if (!target) return false;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  } catch {
    return false;
  }
}

function NavItem({ link, onClick }: { link: NavLink; onClick?: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a
      href={link.href}
      onClick={onClick}
      className="group relative text-xs uppercase tracking-[0.2em] text-white/85 transition duration-300 hover:text-white hover:[text-shadow:0_0_14px_rgba(255,255,255,0.95)]"
    >
      {link.label}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/90 transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  );
}

function LogoutButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={PILL_CTA_CLASSNAME}
    >
      Logout
    </button>
  );
}

function SignupButton({ href, onClick }: { href: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className={PILL_CTA_CLASSNAME}>
      Signup
    </Link>
  );
}

function MobileSignupButton({ href, onClick }: { href: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="mx-auto mt-4 flex w-full max-w-xs items-center justify-center rounded-full bg-white px-12 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.4em] text-black transition hover:bg-white/80"
    >
      Signup
    </Link>
  );
}

export function Navbar({
  links,
  unauthenticatedLinks,
  brand = "SHUB > INNOVATION",
}: {
  links: NavLink[];
  unauthenticatedLinks?: NavLink[];
  brand?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { status } = useSession();

  const visibleLinks = useMemo(() => {
    if (status === "authenticated") return links;
    if (!unauthenticatedLinks?.length) return links;
    const merged = [...links, ...unauthenticatedLinks];
    const seen = new Set<string>();
    return merged.filter((link) => {
      const key = `${link.label}|${link.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [links, status, unauthenticatedLinks]);

  const handleMyTicketsClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navToTicketWallet();
  };

  const handleHashLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!trySmoothScroll(href)) return;
    event.preventDefault();
  };

  const { ctaLink, navItemLinks } = useMemo(() => {
    if (status === "authenticated") {
      return { ctaLink: null as NavLink | null, navItemLinks: visibleLinks };
    }

    const signup =
      visibleLinks.find((link) => link.href === "/signup") ??
      visibleLinks.find((link) => link.label.trim().toLowerCase() === "signup") ??
      null;

    return {
      ctaLink: signup,
      navItemLinks: signup ? visibleLinks.filter((link) => link !== signup) : visibleLinks,
    };
  }, [status, visibleLinks]);

  const loginLink = useMemo(() => {
    if (!unauthenticatedLinks?.length) return null;
    const normalizedLogin = (link: NavLink) => link.label.trim().toLowerCase() === "login";
    return (
      unauthenticatedLinks.find((link) => link.href === "/login" || normalizedLogin(link)) ?? null
    );
  }, [unauthenticatedLinks]);

  const signupLink = useMemo(() => {
    if (ctaLink) return ctaLink;
    if (!unauthenticatedLinks?.length) return { label: "Signup", href: "/signup" };
    const normalizedSignup = (link: NavLink) => link.label.trim().toLowerCase() === "signup";
    return (
      unauthenticatedLinks.find((link) => link.href === "/signup" || normalizedSignup(link)) ?? {
        label: "Signup",
        href: "/signup",
      }
    );
  }, [ctaLink, unauthenticatedLinks]);

  const mobileNavItemLinks = useMemo(() => {
    if (status === "authenticated") return navItemLinks;
    return (unauthenticatedLinks ?? []).filter((link) => link.href !== "/signup");
  }, [status, navItemLinks, unauthenticatedLinks]);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    void signOut({ callbackUrl: "/" });
  };

  const { leftLinks, rightLinks } = useMemo(() => {
    if (navItemLinks.length <= 2) {
      return {
        leftLinks: [] as NavLink[],
        rightLinks: navItemLinks,
      };
    }

    return {
      leftLinks: navItemLinks.slice(0, 3),
      rightLinks: navItemLinks.slice(3),
    };
  }, [navItemLinks]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    document.documentElement.dataset.mobileNavOpen = mobileMenuOpen ? "true" : "false";
    document.body.dataset.mobileNavOpen = mobileMenuOpen ? "true" : "false";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.dataset.mobileNavOpen = "false";
      document.body.dataset.mobileNavOpen = "false";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mx-auto w-full max-w-6xl rounded-full border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] sm:px-6"
      >
        <div className="relative w-full -mx-4 md:hidden sm:-mx-6">
          <div className="flex items-center justify-center">
            <Link
              href="/"
              aria-label={`${brand} home`}
              className="text-xs font-semibold uppercase tracking-[0.22em] transition hover:text-white sm:text-sm sm:tracking-[0.25em]"
            >
              {brand}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              className="absolute right-[-20px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center"
            >
              <span className="relative h-4 w-4">
                <span
                  className={`absolute left-0 block h-0.5 w-4 rounded bg-white transition ${
                    mobileMenuOpen ? "top-1.5 rotate-45" : "top-0.5"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-0.5 w-4 rounded bg-white transition ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-0.5 w-4 rounded bg-white transition ${
                    mobileMenuOpen ? "top-1.5 -rotate-45" : "top-2.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-3 md:flex">
          {status === "authenticated" ? (
            <div className="flex flex-1 items-center justify-start gap-8">
              {leftLinks.map((link) => (
                <NavItem
                  key={link.label}
                  link={link}
                  onClick={
                    link.href === "/ticket-wallet"
                      ? handleMyTicketsClick
                      : link.href.includes("#")
                        ? (event) => handleHashLinkClick(event, link.href)
                        : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-1" />
          )}
          <Link
            href="/"
            aria-label={`${brand} home`}
            className="shrink-0 text-base font-semibold uppercase tracking-[0.26em] transition hover:text-white"
          >
            {brand}
          </Link>
          <div className="flex flex-1 items-center justify-end gap-8">
            {status === "authenticated" ? (
              <>
                {rightLinks.map((link) => (
                  <NavItem
                    key={link.label}
                    link={link}
                    onClick={
                      link.href === "/ticket-wallet"
                        ? handleMyTicketsClick
                        : link.href.includes("#")
                          ? (event) => handleHashLinkClick(event, link.href)
                          : undefined
                    }
                  />
                ))}
                <LogoutButton onClick={handleLogout} />
              </>
            ) : (
              <>
                {loginLink ? (
                  <Link href={loginLink.href} className={AUTH_TEXT_LINK_CLASSNAME}>
                    {loginLink.label}
                  </Link>
                ) : null}
                {signupLink ? <SignupButton href={signupLink.href} /> : null}
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            id="mobile-nav"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[80] h-dvh w-screen overflow-hidden md:hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(170deg,#29050b,#5b0d1a,#940f1f)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(255,255,255,0.08),transparent_40%)]" />

            <div className="relative flex h-dvh flex-col overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-7">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  aria-label={`${brand} home`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold uppercase tracking-[0.22em] transition hover:text-white sm:text-sm sm:tracking-[0.25em]"
                >
                  {brand}
                </Link>
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <span className="relative h-4 w-4">
                    <span className="absolute left-0 top-1.5 block h-0.5 w-4 rotate-45 rounded bg-white" />
                    <span className="absolute left-0 top-1.5 block h-0.5 w-4 -rotate-45 rounded bg-white" />
                  </span>
                </button>
              </div>

              <nav className="mt-12 flex flex-1 flex-col items-start justify-center gap-6 sm:mt-14 sm:gap-8">
                {mobileNavItemLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * index }}
                    onClick={(event) => {
                      if (link.href === "/ticket-wallet") {
                        event.preventDefault();
                        setMobileMenuOpen(false);
                        navToTicketWallet();
                        return;
                      }
                      if (trySmoothScroll(link.href)) {
                        event.preventDefault();
                        setMobileMenuOpen(false);
                        return;
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="text-[clamp(1.95rem,9vw,3.1rem)] font-semibold uppercase tracking-[0.14em] text-white/90"
                  >
                    {link.label}
                  </motion.a>
                ))}
                {status !== "authenticated" && signupLink ? (
                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * mobileNavItemLinks.length }}
                    className="w-full"
                  >
                    <MobileSignupButton href={signupLink.href} onClick={() => setMobileMenuOpen(false)} />
                  </motion.div>
                ) : null}
                {status === "authenticated" ? (
                  <motion.div
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * navItemLinks.length }}
                    className="pt-6"
                  >
                    <LogoutButton onClick={handleLogout} />
                  </motion.div>
                ) : null}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
