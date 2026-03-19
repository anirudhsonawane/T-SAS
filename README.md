# TICKETr - Powered by, SHUB.innovation

Ticket marketplace landing page and booking experience built with Next.js 16.1.6 (App Router + Turbopack) and next-auth for credential + OAuth sign-in.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` by copying `.env.example` and filling in the required values (MongoDB + at least one OAuth provider). Recommended keys:
   ```env
   MONGODB_URI=
   NEXTAUTH_SECRET=

   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   APPLE_CLIENT_ID=
   APPLE_CLIENT_SECRET=
   FACEBOOK_CLIENT_ID=
   FACEBOOK_CLIENT_SECRET=
   GITHUB_ID=
   GITHUB_SECRET=
   ```
3. Run the dev server:
   ```bash
   npm run dev        # webpack
   npm run dev:turbo  # Turbopack experiment
   ```
4. Build for production:
   ```bash
   npm run build
   npm run start
   ```

## Project structure

| Directory | Purpose |
| --- | --- |
| `app/` | Next.js App Router routes, layouts, and components. Subfolders include `api/` handlers, `booking`, `pricing` (public landing + pricing cards), `ticket-wallet` (user ticket vault), auth flows (`login`, `signup`, etc.), and shared UI (`components/`, `lib/`, `providers.tsx`). |
| `public/` | Static assets (icons, background images, manifest, service worker). |
| `scripts/` | Utility scripts and helpers (used during development/workflows). |
| `types/` | Shared TypeScript definitions and helper helpers for the project. |
| `.next/` | Build output (ignored in git). |

Key files:
| File | Description |
| --- | --- |
| `package.json` | Defines scripts and dependencies (Next.js, React 19, next-auth, MongoDB, Razorpay, Tailwind 4). |
| `next.config.ts` | Next.js configuration (Turbopack defaults). |
| `app/api/auth/[...nextauth]/options.ts` | Centralized next-auth options (providers, callbacks, MongoDB integration). |
| `app/api/auth/[...nextauth]/route.ts` | Handler that re-exports `NextAuth` GET/POST. |
| `app/api/tickets/route.ts` | Secured API route (uses `getServerSession`). |
| `app/pricing/page.tsx` | Pricing-focused route that renders `TicketsPricing` with the marketing layout. |
| `app/ticket-wallet/page.tsx` | Authenticated ticket wallet that fetches `/api/tickets` and shows saved passes. |
| `app/layout.tsx` + `app/globals.css` | Theme, fonts, and global styles (Tailwind 4-powered). |
| `app/page.tsx` + `app/booking/page.tsx` | Landing page + protected booking flow UI. |

## Authentication & data

- Credentials + OAuth providers are configured in `app/api/auth/[...nextauth]/options.ts`. Credentials use MongoDB to validate `passwordHash` (via `bcryptjs`), while OAuth routes upsert the user on sign-in.
- Protected pages and API routes import `authOptions` to call `getServerSession`.
- MongoDB helpers live under `app/lib/mongodb` and default database name is `ticket-r`. Use `MONGODB_URI` + optional `MONGODB_DB`.

## Scripts

- `npm run dev`: Webpack dev server (default).  
- `npm run dev:turbo`: Start Next.js with Turbopack.  
- `npm run build`: Create production build.  
- `npm run start`: Run the compiled production server.  
- `npm run lint`: Run ESLint (Next.js config).

## Notes

- The project uses Tailwind CSS 4 (`@tailwindcss/postcss`) and PostCSS 8 via the `@theme inline` syntax in `globals.css`.
- Fonts are served via the local stack (`"Poppins", "Inter", "Segoe UI", system-ui, sans-serif`) to avoid remote fetches from Google Fonts.
