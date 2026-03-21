"use client";

import { motion } from "framer-motion";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Providers = Record<string, ClientSafeProvider>;

function sanitizeCallbackUrl(value?: string | null) {
  if (!value || typeof value !== "string") return "/";
  // Prevent open-redirects; allow only same-origin relative paths.
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  if (value.includes("://")) return "/";
  return value;
}

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 7h9v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 7l-8.5 8.5a5 5 0 0 1-7.07 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 7.5h15v9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m5.2 8.2 6.3 5.2a1 1 0 0 0 1.3 0l6.3-5.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 3.5h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.5h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 18h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7.5 10.5V8.75a4.5 4.5 0 0 1 9 0V10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10.5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  return off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 4.5 21 19.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.5 10.5a2.1 2.1 0 0 0 3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.6 7.7C4.7 9.2 3.4 11.1 3 12c.7 1.5 3.8 7.5 9 7.5 2 0 3.7-.7 5.1-1.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.2 5.4A9.8 9.8 0 0 1 12 5c5.2 0 8.3 6 9 7.5-.2.5-1 2.2-2.4 3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5c5.2 0 8.3 6 9 7.5-.7 1.5-3.8 7.5-9 7.5S3.7 14 3 12.5C3.7 11 6.8 5 12 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ProviderIcon({ id }: { id: string }) {
  const lower = id.toLowerCase();

  if (lower === "google") {
    return (
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.9 6.1 29.7 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.1-.1-2.3-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.9 6.1 29.7 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.6 0 10.7-2.1 14.5-5.5l-6.7-5.5C29.8 34.5 27 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3 5.3-5.5 6.9l.1.1 6.7 5.5C39 38.3 44 33 44 24c0-1.1-.1-2.3-.4-3.5z"
        />
      </svg>
    );
  }

  if (lower === "github") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 .5C5.73.5.5 5.78.5 12.27c0 5.19 3.44 9.6 8.2 11.16.6.12.82-.27.82-.58v-2.13c-3.34.74-4.04-1.67-4.04-1.67-.55-1.45-1.34-1.83-1.34-1.83-1.1-.78.08-.76.08-.76 1.21.09 1.85 1.29 1.85 1.29 1.08 1.92 2.83 1.36 3.52 1.04.11-.81.42-1.36.76-1.67-2.66-.32-5.47-1.38-5.47-6.13 0-1.36.46-2.46 1.22-3.33-.12-.32-.53-1.6.12-3.34 0 0 1-.33 3.3 1.28a10.87 10.87 0 0 1 3-.42c1.02 0 2.05.14 3 .42 2.3-1.61 3.3-1.28 3.3-1.28.65 1.74.24 3.02.12 3.34.76.87 1.22 1.97 1.22 3.33 0 4.76-2.81 5.81-5.49 6.12.43.38.82 1.13.82 2.28v3.39c0 .32.22.7.83.58 4.75-1.56 8.19-5.97 8.19-11.16C23.5 5.78 18.27.5 12 .5z" />
      </svg>
    );
  }

  if (lower === "apple") {
    return (
      <Image
        src="/apple-logo.png"
        alt="Apple"
        width={18}
        height={18}
        className="h-4.5 w-4.5 object-contain invert"
      />
    );
  }

  if (lower === "facebook") {
    return (
      <Image
        src="/facebook.png"
        alt="Facebook"
        width={18}
        height={18}
        className="h-4.5 w-4.5 object-contain"
      />
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.8 12.2 11 14.4l4.3-4.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatProviderName(provider: ClientSafeProvider) {
  if (provider.name) return provider.name;
  if (provider.id) return provider.id[0]?.toUpperCase() + provider.id.slice(1);
  return "Provider";
}

export function AuthForm({
  mode,
  errorParam,
  callbackUrl,
}: {
  mode: "login" | "signup";
  errorParam?: string | null;
  callbackUrl?: string | null;
}) {
  const router = useRouter();
  const { status } = useSession();

  const [providers, setProviders] = useState<Providers | null>(null);
  const [providersError, setProvidersError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heading = mode === "signup" ? "Sign up with email" : "Sign in with email";
  const subheading =
    mode === "signup"
      ? "Create a new account to bring your tickets, details, and updates together. For free"
      : "Make a new doc to bring your words, data, and teams together. For free";
  const safeCallbackUrl = useMemo(() => sanitizeCallbackUrl(callbackUrl), [callbackUrl]);
  const altBaseHref = mode === "signup" ? "/login" : "/signup";
  const altHref = safeCallbackUrl === "/" ? altBaseHref : `${altBaseHref}?next=${encodeURIComponent(safeCallbackUrl)}`;
  const altLabel = mode === "signup" ? "Already have an account? Log in" : "New here? Create an account";

  const providerList = useMemo(() => {
    if (!providers) return [];
    return Object.values(providers).filter((provider) => provider.id !== "credentials");
  }, [providers]);

  const configuredProviderIds = useMemo(() => new Set(providerList.map((p) => p.id.toLowerCase())), [providerList]);

  const oauthButtons = useMemo(
    () => [
      { id: "google", label: "Google" },
      { id: "facebook", label: "Facebook" },
      { id: "apple", label: "Apple" },
    ],
    [],
  );

  const primaryProvider = useMemo(() => {
    if (!providerList.length) return null;
    const google = providerList.find((provider) => provider.id.toLowerCase() === "google");
    if (google) return google;
    const apple = providerList.find((provider) => provider.id.toLowerCase() === "apple");
    if (apple) return apple;
    const github = providerList.find((provider) => provider.id.toLowerCase() === "github");
    if (github) return github;
    return providerList[0] ?? null;
  }, [providerList]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(safeCallbackUrl);
    }
  }, [router, safeCallbackUrl, status]);

  useEffect(() => {
    let mounted = true;
    getProviders()
      .then((result) => {
        if (!mounted) return;
        setProviders((result ?? null) as Providers | null);
      })
      .catch(() => {
        if (!mounted) return;
        setProvidersError(
          "Auth providers are not available yet. Add OAuth env vars (e.g. GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) and restart the dev server.",
        );
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden rounded-[36px] border border-white/25 bg-white/10 text-white backdrop-blur-2xl shadow-[0_18px_80px_rgba(0,0,0,0.55)]"
    >
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/10 text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <ArrowIcon />
          </div>
          <h2 className="mt-5 text-2xl font-semibold sm:text-[28px]">{heading}</h2>
          <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-white/70">{subheading}</p>
        </div>

        {errorParam ? (
          <div className="mt-6 rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-100/90">
            Sign-in failed. {errorParam === "OAuthAccountNotLinked" ? "Try signing in with the same provider." : null}
          </div>
        ) : null}

        {providersError ? (
          <div className="mt-6 rounded-2xl border border-amber-200/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-100/90">
            {providersError}
          </div>
        ) : null}

        {formMessage ? (
          <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-white/80">
            {formMessage}
          </div>
        ) : null}

        <div className="mt-7 space-y-4">
          <form
            className="space-y-3"
	            onSubmit={async (event) => {
	              event.preventDefault();
	              if (isSubmitting) return;
	              setFormMessage(null);

              const normalizedEmail = email.trim().toLowerCase();
              if (!normalizedEmail) {
                setFormMessage("Please enter your email.");
                return;
              }
              if (!password) {
                setFormMessage("Please enter your password.");
                return;
              }
              if (mode === "signup" && password.length < 8) {
                setFormMessage("Password must be at least 8 characters.");
                return;
              }
	              if (mode === "signup") {
	                const normalizedName = name.trim();
	                if (!normalizedName) {
	                  setFormMessage("Please enter your name.");
	                  return;
	                }
	                const normalizedMobile = mobile.replace(/\s+/g, "");
	                if (!normalizedMobile) {
	                  setFormMessage("Please enter your mobile number.");
	                  return;
	                }
                if (!/^\+?[0-9]{8,15}$/.test(normalizedMobile)) {
                  setFormMessage("Please enter a valid mobile number.");
                  return;
                }
                if (!confirmPassword) {
                  setFormMessage("Please re-type your password.");
                  return;
                }
                if (password !== confirmPassword) {
                  setFormMessage("Passwords do not match.");
                  return;
                }
              }

	              setIsSubmitting(true);
	              try {
	                const normalizedMobile = mobile.replace(/\s+/g, "");
	                const normalizedName = name.trim();
	                if (mode === "signup") {
	                  const res = await fetch("/api/auth/signup", {
	                    method: "POST",
	                    headers: { "Content-Type": "application/json" },
	                    body: JSON.stringify({ email: normalizedEmail, name: normalizedName, mobile: normalizedMobile, password }),
	                  });
	                  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
	                  if (!res.ok || !data?.ok) {
	                    setFormMessage(data?.error ?? "Signup failed. Please try again.");
	                    return;
	                  }
	                }

	                const result = await signIn("credentials", {
	                  email: normalizedEmail,
	                  password,
	                  redirect: false,
	                  callbackUrl: safeCallbackUrl,
	                });

	                if (result?.error) {
	                  if (mode === "signup") {
	                    setFormMessage("Account created. Please log in.");
	                    router.replace(altHref);
	                    return;
	                  }
	                  setFormMessage("Invalid email or password.");
	                  return;
	                }

                router.replace(safeCallbackUrl);
              } catch {
                setFormMessage("Something went wrong. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <label className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/55">
                <MailIcon />
              </span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                type="email"
                autoComplete="email"
                className="h-11 w-full rounded-2xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.25)] outline-none transition placeholder:text-white/45 focus:border-white/35 focus:bg-white/15"
              />
            </label>

            {mode === "signup" ? (
              <>
                <label className="relative block">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/55">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.5 21c0-2.5-3.5-4-7.5-4s-7.5 1.5-7.5 4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Full Name"
                    type="text"
                    autoComplete="name"
                    className="h-11 w-full rounded-2xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.25)] outline-none transition placeholder:text-white/45 focus:border-white/35 focus:bg-white/15"
                  />
                </label>
                <label className="relative block">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/55">
                    <PhoneIcon />
                  </span>
                  <input
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    placeholder="Mobile"
                    inputMode="tel"
                    autoComplete="tel"
                    className="h-11 w-full rounded-2xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.25)] outline-none transition placeholder:text-white/45 focus:border-white/35 focus:bg-white/15"
                  />
                </label>
              </>
            ) : null}

            <label className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/55">
                <LockIcon />
              </span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type={passwordVisible ? "text" : "password"}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="h-11 w-full rounded-2xl border border-white/20 bg-white/10 pl-10 pr-11 text-sm text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.25)] outline-none transition placeholder:text-white/45 focus:border-white/35 focus:bg-white/15"
              />
              <button
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white/80"
              >
                <EyeIcon off={!passwordVisible} />
              </button>
            </label>

            {mode === "signup" ? (
              <label className="relative block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/55">
                  <LockIcon />
                </span>
                <input
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-11 w-full rounded-2xl border border-white/20 bg-white/10 pl-10 pr-11 text-sm text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.25)] outline-none transition placeholder:text-white/45 focus:border-white/35 focus:bg-white/15"
                />
                <button
                  type="button"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  onClick={() => setPasswordVisible((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white/80"
                >
                  <EyeIcon off={!passwordVisible} />
                </button>
              </label>
            ) : null}

            <div className="flex justify-end">
              <Link href="/#contact" className="text-xs text-white/70 hover:text-white underline underline-offset-4">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] text-sm font-semibold text-white/95 shadow-[0_16px_45px_rgba(0,0,0,0.45)] ring-1 ring-white/20 transition hover:ring-white/30 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {isSubmitting ? "Please wait..." : mode === "signup" ? "Sign up" : "Login"}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-white/55">or sign in with</span>
            <span className="h-px flex-1 bg-white/15" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {oauthButtons.map((button) => (
              <button
                key={button.id}
                type="button"
                aria-label={`Continue with ${button.label}`}
                title={button.label}
                onClick={() => {
                  if (button.id === "facebook" || button.id === "apple") {
                    return;
                  }

                  if (!configuredProviderIds.has(button.id)) {
                    setFormMessage(
                      `${button.label} OAuth isn't configured yet. Add its env vars in .env.local and restart the dev server.`,
                    );
                    return;
                  }

                  void signIn(button.id, { callbackUrl: safeCallbackUrl });
                }}
                className="flex h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white/85 shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition hover:border-white/30 hover:bg-white/15"
              >
                <ProviderIcon id={button.id} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href={altHref} className="text-xs text-white/80 underline underline-offset-4 hover:text-white">
            {altLabel}
          </Link>
          
        </div>
      </div>
    </motion.div>
  );
}
