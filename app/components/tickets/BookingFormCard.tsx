"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const ticketTypes = ["Festival Ground", "VIP Experience", "Premium Box"];
const paymentMethods = ["Credit Card", "Debit Card", "UPI", "PayPal"];

const containerBaseClass =
  "w-full rounded-[32px] border border-black/5 bg-white p-10 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOutCubic } },
};

const buttonVariants = {
  hover: { boxShadow: "0 0 25px rgba(255,59,59,0.5)", scale: 1.02 },
  tap: { scale: 0.97 },
};

export function BookingFormCard({ className }: { className?: string }) {
  const [ticketType, setTicketType] = useState(ticketTypes[0]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrement = () => setQuantity((prev) => Math.max(prev - 1, 1));

  return (
    <motion.div
      className={`${containerBaseClass} ${className ?? ""}`}
      variants={cardVariants}
      initial="hidden"
      animate="show"
    >
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.5em] text-neutral-500">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff3b3b] shadow-[0_0_18px_rgba(255,59,59,0.85)]" />
          <span className="text-black text-[0.65rem] tracking-[0.55em]">BOOKING FORM</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#111111] sm:text-4xl">Book Your Tickets Now</h1>
        <p className="text-sm text-[#777777]">Reserve your spot before the crowd sells out.</p>
      </div>

      <form className="mt-10 space-y-6" aria-label="Reservation form">
        <div className="grid gap-4 sm:grid-cols-2">
          {["First Name", "Last Name"].map((label) => (
            <label key={label} className="group">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">{label}</span>
              <input
                type="text"
                placeholder={label}
                className="mt-2 w-full rounded-[18px] border border-black/5 bg-white px-4 py-3 text-base text-[#111111] placeholder:text-[#b1b1b1] transition focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/30"
              />
            </label>
          ))}
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-[18px] border border-black/5 bg-white px-4 py-3 text-base text-[#111111] placeholder:text-[#b1b1b1] transition focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/30"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">Ticket type</span>
            <select
              value={ticketType}
              onChange={(event) => setTicketType(event.currentTarget.value)}
              className="mt-2 w-full appearance-none rounded-[18px] border border-black/5 bg-white px-4 py-3 text-base text-[#111111] focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/30"
            >
              {ticketTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-[18px] border border-black/5 bg-white px-3 py-3 text-[#111111] shadow-inner shadow-black/5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">Quantity</span>
            <div className="mt-2 flex w-full items-center justify-between text-2xl font-semibold">
              <motion.button
                type="button"
                onClick={decrement}
                whileTap={{ scale: 0.9 }}
                className="h-10 w-10 rounded-full border border-black/10 bg-white text-lg font-semibold text-[#111111] transition hover:bg-black/5"
              >
                -
              </motion.button>
              <span className="mx-4 text-2xl">{quantity}</span>
              <motion.button
                type="button"
                onClick={increment}
                whileTap={{ scale: 0.9 }}
                className="h-10 w-10 rounded-full border border-black/10 bg-white text-lg font-semibold text-[#111111] transition hover:bg-black/5"
              >
                +
              </motion.button>
            </div>
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-black/60">Payment Method</span>
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.currentTarget.value)}
            className="mt-2 w-full appearance-none rounded-[18px] border border-black/5 bg-white px-4 py-3 text-base text-[#111111] focus:border-[#ff3b3b] focus:outline-none focus:ring-2 focus:ring-[#ff3b3b]/30"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <motion.button
          type="submit"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="w-full rounded-full bg-[#ff3b3b] px-6 py-3 text-center text-base font-semibold uppercase tracking-[0.3em] text-white transition"
        >
          Make a Reservation
        </motion.button>
      </form>
    </motion.div>
  );
}
