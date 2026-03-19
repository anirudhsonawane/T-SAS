"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type TicketTier = {
  name: string;
  price: number;
  blurb: string;
  perks: string[];
  badge?: string;
  statusWord: string;
};

const tiers: TicketTier[] = [
  {
    name: "General",
    price: 65,
    blurb: "Best value for a full-night experience.",
    perks: ["Festival ground access", "Merch booth discounts", "Fast entry lane"],
    statusWord: "FILLING FAST",
  },
  {
    name: "VIP",
    price: 145,
    blurb: "Closer to the stage with premium perks.",
    perks: ["VIP seating", "Exclusive lounge", "Priority merch pickup"],
    badge: "Most Popular",
    statusWord: "FEW LEFT",
  },
  {
    name: "Premium Box",
    price: 250,
    blurb: "Top-tier comfort with the best view.",
    perks: ["Private box seating", "Complimentary drinks", "Dedicated host"],
    statusWord: "AVAILABLE",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const confirmationVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, type: "spring", stiffness: 130, damping: 18 } },
  exit: { opacity: 0, x: 32, transition: { duration: 0.25 } },
};

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF2C55] shadow-[0_0_16px_rgba(255,44,85,0.75)]" />
      <span className="text-xs font-semibold uppercase tracking-[0.45em] text-white/70">{text}</span>
    </div>
  );
}

function TicketFrame({ stroke = "#FF2C55" }: { stroke?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 160" preserveAspectRatio="none" className="h-full w-full">
      <path
        d="M14 8
           H86
           Q92 8 92 14
           V150
           H90
           h-0.5
           a6 6 0 0 0 -11.5 0
           h-2
           a6 6 0 0 0 -11.5 0
           h-2
           a6 6 0 0 0 -11.5 0
           h-2
           a6 6 0 0 0 -11.5 0
           h-2
           a6 6 0 0 0 -11.5 0
           h-2
           a6 6 0 0 0 -11.5 0
           h-1
           H8
           V14
           Q8 8 14 8
           Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function TicketCard({
  tier,
  highlighted,
  transparent,
  frameInsetClassName = "inset-0",
  onBookNow,
}: {
  tier: TicketTier;
  highlighted?: boolean;
  transparent?: boolean;
  frameInsetClassName?: string;
  onBookNow: (tier: TicketTier) => void;
}) {
  return (
    <article
      className={
        "relative w-full overflow-hidden rounded-[30px] text-white" +
        (transparent
          ? " bg-transparent"
          : " bg-[#0b0206] shadow-[0_18px_55px_rgba(0,0,0,0.55)]" + (highlighted ? "" : " ring-1 ring-white/8"))
      }
    >
      <div className="relative aspect-[9/16] w-full bg-transparent">
        <div aria-hidden className={"pointer-events-none absolute " + frameInsetClassName}>
          <TicketFrame stroke={highlighted ? "rgba(255,255,255,0.14)" : undefined} />
        </div>

        <div className="absolute inset-0 flex flex-col px-8 pb-16 pt-10 sm:px-9">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Ticket</p>
              <h3 className="text-2xl font-semibold leading-tight">{tier.name}</h3>
            </div>
            {tier.badge ? (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85 backdrop-blur">
                {tier.badge}
              </span>
            ) : null}
          </div>

          <div className="mt-6">
            <p className="text-5xl font-semibold tracking-tight">
              ₹{tier.price}
              <span className="ml-2 align-middle text-sm font-semibold text-white/60">/person</span>
            </p>
            <p className="mt-2 text-sm text-white/70">{tier.blurb}</p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-white/75">
            {tier.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF2C55]" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          <div
            aria-hidden
            className="mt-6 h-px w-full bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.45)_0_10px,transparent_10px_22px)]"
          />

          <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-white/55 whitespace-nowrap">
            {tier.statusWord}
          </p>

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={() => onBookNow(tier)}
              className="group relative isolate flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl px-5 text-sm font-semibold text-white/95 bg-[linear-gradient(135deg,rgba(255,44,85,0.9),rgba(138,43,226,0.75))] transition-transform duration-300 ease-out hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              />
              <span className="relative z-10 transition-colors duration-300 ease-out group-hover:text-black">BOOK NOW</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

type BookingFields = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  ticketType: string;
};

const RAZORPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
const EVENT_ID = "shub_innovation_2026";
const EVENT_NAME = "Shub>Innovation Festival 2026";

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export function TicketsPricing({ sectionId, embedded }: { sectionId?: string; embedded?: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const bookingRef = useRef<HTMLDivElement | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isVerifyingTicket, setIsVerifyingTicket] = useState(false);
  const [fields, setFields] = useState<BookingFields>({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    ticketType: tiers[0].name,
  });
  const [quantity, setQuantity] = useState(1);
  const sessionFirstName = session?.user?.name?.split(" ").at(0) ?? "";
  const sessionLastName =
    session?.user?.name && session?.user?.name?.split(" ").length > 1
      ? session?.user?.name?.split(" ").slice(1).join(" ")
      : "";
  const sessionMobile = (session?.user as { phone?: string; mobile?: string })?.phone ?? (session?.user as { phone?: string; mobile?: string })?.mobile ?? "";
  const sessionEmail = session?.user?.email ?? "";
  const isEmailLocked = Boolean(sessionEmail);

  useEffect(() => {
    setFields((prev) => ({
      firstName: prev.firstName || sessionFirstName,
      lastName: prev.lastName || sessionLastName,
      mobile: prev.mobile || sessionMobile,
      email: sessionEmail || prev.email,
      ticketType: prev.ticketType,
    }));
  }, [sessionFirstName, sessionLastName, sessionMobile, sessionEmail]);

  useEffect(() => {
    if (session) return;
    setFormVisible(false);
  }, [session]);

  useEffect(() => {
    if (!session) return;
    let pendingTier: string | null = null;
    try {
      pendingTier = sessionStorage.getItem("pendingBookingTier");
      if (pendingTier) sessionStorage.removeItem("pendingBookingTier");
    } catch {
      pendingTier = null;
    }
    if (!pendingTier) return;

    const tier = tiers.find((t) => t.name === pendingTier);
    if (!tier) return;

    setSelectedTier(tier);
    setFields((prev) => ({ ...prev, ticketType: tier.name }));
    setPaymentError(null);
    setQuantity(1);
    setFormVisible(true);
    setConfirmationVisible(true);
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [session]);

  const handleBookNow = (tier: TicketTier) => {
    if (!session) {
      try {
        sessionStorage.setItem("pendingBookingTier", tier.name);
      } catch {
        // ignore storage errors
      }
      const next = `${window.location.pathname}${window.location.search}`;
      startTransition(() => router.push(`/login?next=${encodeURIComponent(next)}`));
      return;
    }

    setSelectedTier(tier);
    setFields((prev) => ({
      ...prev,
      ticketType: tier.name,
    }));
    setPaymentError(null);
    setQuantity(1);
    setFormVisible(true);
    setConfirmationVisible(true);
    requestAnimationFrame(() => {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleFieldChange = (field: keyof BookingFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!confirmationVisible) return;
    const timer = window.setTimeout(() => {
      setConfirmationVisible(false);
    }, 4200);
    return () => {
      window.clearTimeout(timer);
    };
  }, [confirmationVisible]);

  useEffect(() => {
    const matching = tiers.find((t) => t.name === fields.ticketType);
    if (matching) {
      setSelectedTier(matching);
    }
  }, [fields.ticketType]);

  const handleQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const bookingValidation = useMemo(() => {
    const firstName = fields.firstName.trim();
    const lastName = fields.lastName.trim();
    const email = fields.email.trim().toLowerCase();
    const mobile = fields.mobile.replace(/\s+/g, "");

    if (!firstName) return { ok: false, message: "Please enter your first name." };
    if (!lastName) return { ok: false, message: "Please enter your last name." };
    if (!mobile) return { ok: false, message: "Please enter your mobile number." };
    if (!/^\+?[0-9]{8,15}$/.test(mobile)) return { ok: false, message: "Please enter a valid mobile number." };
    if (!email) return { ok: false, message: "Please enter your email." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Please enter a valid email." };

    return { ok: true, message: "" };
  }, [fields.email, fields.firstName, fields.lastName, fields.mobile]);

  const fetchWithTimeout = async (input: RequestInfo | URL, init: RequestInit & { timeoutMs?: number } = {}) => {
    const { timeoutMs = 15000, ...rest } = init;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, { ...rest, signal: controller.signal });
    } finally {
      window.clearTimeout(timer);
    }
  };

  const handlePayment = async () => {
    if (!selectedTier) {
      setPaymentError("Select a ticket tier first.");
      return;
    }
    if (!bookingValidation.ok) {
      setPaymentError(bookingValidation.message);
      return;
    }
    if (!RAZORPAY_PUBLIC_KEY) {
      setPaymentError("Payment gateway is not configured.");
      return;
    }
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setPaymentError("Unable to load Razorpay checkout.");
      return;
    }

    const amount = selectedTier.price * quantity;
    setIsCreatingOrder(true);
    const createOrderResponse = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency: "INR",
        ticketType: selectedTier.name,
        quantity,
        eventId: EVENT_ID,
        userEmail: session?.user?.email,
      }),
    });

    if (!createOrderResponse.ok) {
      const errorPayload = await createOrderResponse.json().catch(() => ({}));
      setPaymentError(errorPayload?.error ?? "Unable to create payment order.");
      setIsCreatingOrder(false);
      return;
    }

    const order = await createOrderResponse.json();
    setIsCreatingOrder(false);

    const normalizedFirstName = fields.firstName.trim();
    const normalizedLastName = fields.lastName.trim();
    const normalizedMobile = fields.mobile.replace(/\s+/g, "");
    const normalizedEmail = fields.email.trim().toLowerCase();

    const options = {
      key: RAZORPAY_PUBLIC_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "Shub>Innovation",
      description: `${selectedTier.name} ticket`,
      order_id: order.order_id,
      prefill: {
        name: `${normalizedFirstName} ${normalizedLastName}`.trim(),
        email: normalizedEmail,
        contact: normalizedMobile,
      },
      theme: { color: "#ff3b3b" },
      modal: {
        ondismiss: () => {
          setIsCreatingOrder(false);
          setIsVerifyingTicket(false);
        },
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        setPaymentError(null);
        setIsVerifyingTicket(true);
        let verifyResponse: Response;
        try {
          verifyResponse = await fetchWithTimeout("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            timeoutMs: 15000,
            body: JSON.stringify({
              ...response,
              ticketType: selectedTier.name,
              quantity,
              eventId: EVENT_ID,
              eventName: EVENT_NAME,
              amount,
              userEmail: session?.user?.email,
              attendeeFirstName: normalizedFirstName,
              attendeeLastName: normalizedLastName,
              attendeeMobile: normalizedMobile,
              attendeeEmail: normalizedEmail,
            }),
          });
        } catch (error) {
          const message =
            error instanceof DOMException && error.name === "AbortError"
              ? "Ticket generation timed out. Please open Ticket Wallet in a moment."
              : "Payment verification failed. Please try again.";
          setPaymentError(message);
          setIsVerifyingTicket(false);
          startTransition(() => router.push("/ticket-wallet"));
          return;
        }

        if (!verifyResponse.ok) {
          setPaymentError("Payment verification failed.");
          setIsVerifyingTicket(false);
          startTransition(() => router.push("/payment-failed"));
          return;
        }
        const result = await verifyResponse.json();
        const ticketJson = JSON.stringify(result.ticket);
        sessionStorage.setItem("latestTicket", ticketJson);
        localStorage.setItem("latestTicket", ticketJson);
        try {
          const stored = localStorage.getItem("tickets");
          const parsed = stored ? (JSON.parse(stored) as unknown) : [];
          const list = Array.isArray(parsed) ? (parsed as unknown[]) : [];
          const next = [result.ticket, ...list].filter(
            (item, index, arr) =>
              typeof (item as { ticketId?: unknown } | null)?.ticketId === "string" &&
              arr.findIndex((other) => (other as { ticketId?: unknown } | null)?.ticketId === (item as { ticketId?: unknown } | null)?.ticketId) ===
                index,
          );
          localStorage.setItem("tickets", JSON.stringify(next.slice(0, 25)));
        } catch {
          // ignore storage errors
        }
        const ticketId = result?.ticket?.ticketId as string | undefined;
        setIsVerifyingTicket(false);
        startTransition(() =>
          router.push(ticketId ? `/ticket-wallet?ticketId=${encodeURIComponent(ticketId)}` : "/ticket-wallet"),
        );
      },
    };

    setPaymentError(null);
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (payload: unknown) => {
      const description =
        typeof (payload as { error?: { description?: unknown } } | null)?.error?.description === "string"
          ? (payload as { error: { description: string } }).error.description
          : null;
      setPaymentError(description ?? "Payment failed.");
      setIsCreatingOrder(false);
      setIsVerifyingTicket(false);
      startTransition(() => router.push("/payment-failed"));
    });
    rzp.open();
  };

  const canCheckout = Boolean(selectedTier);
  const canPay = canCheckout && bookingValidation.ok;
  return (
    <section
      id={sectionId}
      className={
        embedded ? "scroll-mt-28 py-16 md:py-20" : "scroll-mt-28 px-4 py-16 sm:px-6 md:py-20 lg:px-10 xl:px-14"
      }
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={embedded ? "w-full" : "mx-auto w-full max-w-6xl"}
      >
        <motion.div variants={fadeUp}>
          <SectionLabel text="PRICING" />
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="mt-6 text-balance text-center text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight"
        >
          Pick your ticket, then claim your spot.
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-4 max-w-2xl text-pretty text-center text-sm leading-relaxed text-white/70 sm:text-base"
        >
          Simple tiers, clear perks, and a ticket layout that matches the vibe.
        </motion.p>

        <div className="relative mt-10 md:mt-12">
          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {tiers.map((tier, index) => (
              <motion.div key={tier.name} variants={item} className="mx-auto w-full max-w-[340px]">
                {index === 1 ? (
                  <div className="relative rounded-[15px] bg-gradient-to-b from-red-500 via-pink-500 to-red-500 px-[10px] pb-[10px] pt-[35px]">
                    <div className="pointer-events-none absolute left-1/2 top-[9px] -translate-x-1/2 whitespace-nowrap text-center text-[14px] font-semibold uppercase tracking-[0.32em] text-white/90">
                      BEST DEAL AT BEST PRICE
                    </div>
                    <TicketCard tier={tier} highlighted onBookNow={handleBookNow} />
                  </div>
                ) : (
                  <TicketCard tier={tier} transparent={index === 0 || index === 2} onBookNow={handleBookNow} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {formVisible && session ? (
          <motion.div
            ref={bookingRef}
            variants={fadeUp}
            className="mt-16"
            id="booking"
          >
            <div className="mx-auto max-w-3xl rounded-[32px] border border-white/5 bg-white/95 p-10 shadow-[0_25px_90px_rgba(0,0,0,0.35)] text-[#111111] relative overflow-hidden">
              <div className="space-y-4 text-center text-black">
                <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.5em] text-neutral-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff3b3b]" />
                  <span>BOOKING FORM</span>
                </div>
                <h1 className="text-3xl font-semibold">Book Your Tickets Now</h1>
                <p className="text-sm text-[#555]">Reserve your spot before the crowd sells out.</p>
              </div>

              <AnimatePresence>
                {confirmationVisible && selectedTier ? (
                  <motion.div
                    key={selectedTier.name}
                    variants={confirmationVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="pointer-events-none absolute right-6 top-6 z-30 flex max-w-[280px] items-center gap-3 rounded-[24px] border border-green-200 bg-lime-50 px-4 py-3 text-[#1a3f1a] shadow-[0_20px_40px_rgba(72,187,120,0.25)]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                      <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="text-sm font-semibold uppercase tracking-[0.2em]">
                      SELECTED {selectedTier.name.toUpperCase()} TICKET
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <form className="mt-10 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666]">Name</span>
                    <input
                      type="text"
                      value={fields.firstName}
                      onChange={(event) => handleFieldChange("firstName", event.target.value)}
                      required
                      autoComplete="given-name"
                      className="mt-2 w-full rounded-[18px] border border-[#ececec] bg-white px-4 py-3 text-sm text-black placeholder:text-[#aaa] focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/30"
                      placeholder="First Name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666]">Last Name</span>
                    <input
                      type="text"
                      value={fields.lastName}
                      onChange={(event) => handleFieldChange("lastName", event.target.value)}
                      required
                      autoComplete="family-name"
                      className="mt-2 w-full rounded-[18px] border border-[#ececec] bg-white px-4 py-3 text-sm text-black placeholder:text-[#aaa] focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/30"
                      placeholder="Last Name"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666]">Mobile</span>
                  <input
                    type="tel"
                    value={fields.mobile}
                    onChange={(event) => handleFieldChange("mobile", event.target.value)}
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    className="mt-2 w-full rounded-[18px] border border-[#ececec] bg-white px-4 py-3 text-sm text-black placeholder:text-[#aaa] focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/30"
                    placeholder="Mobile"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666]">
                    Email <span className="text-[0.6rem] font-normal uppercase tracking-[0.3em] text-[#aaa]">(weâ€™ll send tickets here)</span>
                  </span>
                  <input
                    type="email"
                    value={fields.email}
                    readOnly={isEmailLocked}
                    aria-readonly={isEmailLocked}
                    title={isEmailLocked ? "Email is linked to your account" : undefined}
                    onChange={(event) => {
                      if (isEmailLocked) return;
                      handleFieldChange("email", event.target.value);
                    }}
                    required
                    autoComplete="email"
                    className={`mt-2 w-full rounded-[18px] border border-[#ececec] px-4 py-3 text-sm placeholder:text-[#aaa] focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/30 ${
                      isEmailLocked ? "cursor-not-allowed bg-[#f7f7f7] text-[#555]" : "bg-white text-black"
                    }`}
                    placeholder="you@example.com"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666]">Ticket Type</span>
                  <select
                    value={fields.ticketType}
                    onChange={(event) => handleFieldChange("ticketType", event.target.value)}
                    className="mt-2 w-full appearance-none rounded-[18px] border border-[#ececec] bg-white px-4 py-3 text-sm text-black transition-all duration-300 ease-out focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/40"
                  >
                      {tiers.map((tierOption) => (
                        <option key={tierOption.name} value={tierOption.name}>
                          {tierOption.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="rounded-[18px] border border-[#ececec] bg-white px-3 py-3 text-black shadow-inner">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#666]">Quantity</span>
                    <div className="mt-2 flex w-full items-center justify-between text-2xl font-semibold">
                      <button
                        type="button"
                        onClick={() => handleQuantity(-1)}
                        className="h-10 w-10 rounded-full border border-[#e0e0e0] text-lg font-semibold transition hover:border-[#ff3b3b] hover:text-[#ff3b3b]"
                      >
                        -
                      </button>
                      <span className="mx-4 text-2xl">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantity(1)}
                        className="h-10 w-10 rounded-full border border-[#e0e0e0] text-lg font-semibold transition hover:border-[#ff3b3b] hover:text-[#ff3b3b]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-2 rounded-[18px] border border-[#ececec] bg-white px-4 py-3 text-sm text-[#444]">
                  <p className="font-semibold uppercase tracking-[0.3em] text-[#444]">Payment</p>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={!canPay || isCreatingOrder || isVerifyingTicket}
                    className={`mt-3 w-full rounded-full bg-[#ff3b3b] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#e12f2f] ${
                      !canPay || isCreatingOrder || isVerifyingTicket ? "opacity-40 pointer-events-none" : ""
                    }`}
                  >
                    {isCreatingOrder ? "Opening checkout..." : isVerifyingTicket ? "Generating ticket..." : "Pay with Razorpay"}
                  </button>
                </div>

                {paymentError && (
                  <p className="text-xs text-[#b80000]">{paymentError}</p>
                )}

              </form>
            </div>
          </motion.div>
        ) : null}
      </motion.div>

      <AnimatePresence>
        {isVerifyingTicket ? (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-6 text-center backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b0206] p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/70">Processing</p>
              <p className="mt-3 text-lg font-semibold">Generating your ticket…</p>
              <p className="mt-2 text-sm text-white/70">This should only take a few seconds. Please don’t close the page.</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
