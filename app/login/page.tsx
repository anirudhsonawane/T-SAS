import { AuthForm } from "@/app/components/auth/AuthForm";
import { AuthShell } from "@/app/components/auth/AuthShell";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function LoginPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const resolved = searchParams ? await searchParams : {};
  const errorParam = Array.isArray(resolved.error) ? resolved.error[0] : resolved.error;
  const nextParam = Array.isArray(resolved.next) ? resolved.next[0] : resolved.next;

  return (
    <AuthShell>
      <AuthForm mode="login" errorParam={errorParam} callbackUrl={nextParam} />
    </AuthShell>
  );
}
