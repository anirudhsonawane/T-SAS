"use client";

import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1b1b1f] to-[#0b0206] p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
          <p className="text-sm uppercase tracking-[0.5em] text-red-400">Payment Failed</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Oops, something went wrong.</h1>
          <p className="mt-2 text-sm text-white/70">
            We could not verify the transaction. Please retry your purchase or contact support if the issue persists.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-gradient-to-r from-[#ff3b3b] to-[#ff6c3d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg transition hover:scale-[1.01]"
            >
              Return to Home
            </Link>
            <Link href="#booking" className="text-sm text-white/70 underline-offset-4 hover:text-white">
              Try booking again
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
