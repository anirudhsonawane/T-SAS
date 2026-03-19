import { BookingFormCard } from "@/app/components/tickets/BookingFormCard";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

type SearchParams = Record<string, string | string[] | undefined>;

function toQueryString(params: SearchParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value);
    else if (Array.isArray(value) && typeof value[0] === "string") query.set(key, value[0]);
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export default async function BookingPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    const resolved = searchParams ? await searchParams : {};
    const next = `/booking${toQueryString(resolved)}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/bm-bg.png')] bg-cover bg-center"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <BookingFormCard className="mx-auto" />
        </div>
      </div>
    </main>
  );
}
