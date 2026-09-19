"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { errInfo } from "@/lib/api";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next") || "/";
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<ReturnType<typeof errInfo> | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    try { await login(email.trim(), password); router.replace(next.startsWith("/") ? next : "/"); }
    catch (x) { setErr(errInfo(x)); setBusy(false); }
  }
  const pending = err && (err.code?.includes("pending") || err.code?.includes("approval") || err.status === 403);

  return (
    <form onSubmit={submit} className="card mx-auto w-full max-w-md space-y-5 p-8">
      <div><h1 className="text-3xl font-bold tracking-tight">Welcome back</h1><p className="mt-1 text-sm text-muted">Sign in to order, pay and track deliveries.</p></div>
      {err && (pending
        ? <div role="alert" className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"><Clock className="mt-0.5 shrink-0" size={18} /><div><p className="font-semibold">Account awaiting approval</p><p>{err.detail || "Our team is still verifying your business account. We'll be in touch shortly."}</p></div></div>
        : <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-800"><b>{err.title}.</b> {err.detail}</p>)}
      <div><label className="label" htmlFor="email">Email</label><input id="email" className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><label className="label" htmlFor="pw">Password</label><input id="pw" className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <a href="https://wa.me/233242226555?text=Hi%2C%20I%20forgot%20my%20Top-Up%20password" target="_blank" rel="noopener" className="block text-right text-xs font-semibold text-brand">Forgot your password?</a>
      <button className="btn btn-primary w-full" disabled={busy}>{busy ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />} Sign in</button>
      <p className="text-center text-sm text-muted">New business? <Link href="/register" className="font-semibold text-brand">Create an account</Link></p>
    </form>
  );
}
export default function LoginPage() { return <div className="container-x py-12"><Suspense><LoginForm /></Suspense></div>; }
