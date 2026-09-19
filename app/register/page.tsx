"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SUPPORT } from "@/lib/format";
import { Pending } from "@/components/Pending";

/**
 * PENDING BACKEND: no customer self-signup endpoint exists yet (accounts are
 * created staff-side). Until POST /customer/auth/register lands, this form
 * hands the application to the team via WhatsApp and shows the pending state.
 */
export default function RegisterPage() {
  const [f, setF] = useState({ name: "", kind: "clinic", contact: "", phone: "", email: "", licence: "", expiry: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const text = `New business account request%0A${Object.entries({ Business: f.name, Type: f.kind, Contact: f.contact, Phone: f.phone, Email: f.email, "Licence no": f.licence, "Licence expiry": f.expiry }).map(([k, v]) => `${k}: ${encodeURIComponent(v)}`).join("%0A")}`;

  if (sent) return (
    <div className="container-x py-12"><div className="card mx-auto max-w-md space-y-4 p-8 text-center">
      <CheckCircle2 className="mx-auto text-leaf" size={48} />
      <h1 className="text-2xl font-bold">Application pending approval</h1>
      <p className="text-sm text-muted">We verify every business licence before activating an account. Send your details to our team to speed things up — you&apos;ll get login details once approved.</p>
      <a href={`https://wa.me/${SUPPORT.whatsapp}?text=${text}`} target="_blank" rel="noopener" className="btn w-full bg-[#25D366] text-white"><MessageCircle size={18} /> Send details on WhatsApp</a>
      <Link href="/" className="btn btn-soft w-full">Back to home</Link>
    </div></div>
  );

  return (
    <div className="container-x py-12">
      <Pending waitingFor="POST /customer/auth/register (self-signup)" className="mx-auto max-w-xl"><form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="card mx-auto max-w-xl space-y-5 p-8">
        <div><h1 className="text-3xl font-bold tracking-tight">Create a business account</h1><p className="mt-1 text-sm text-muted">For clinics, shops and wholesalers. New accounts are approved by our team before first use.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="label" htmlFor="n">Business name</label><input id="n" className="input" required value={f.name} onChange={set("name")} /></div>
          <div><label className="label" htmlFor="k">Account type</label><select id="k" className="input" value={f.kind} onChange={set("kind")}><option value="clinic">Clinic</option><option value="wholesale">Wholesaler</option><option value="retail">Retail shop</option></select></div>
          <div><label className="label" htmlFor="c">Contact person</label><input id="c" className="input" required value={f.contact} onChange={set("contact")} /></div>
          <div><label className="label" htmlFor="p">Phone</label><input id="p" className="input" type="tel" required value={f.phone} onChange={set("phone")} /></div>
          <div><label className="label" htmlFor="e">Email</label><input id="e" className="input" type="email" required value={f.email} onChange={set("email")} /></div>
          <div><label className="label" htmlFor="l">Licence number</label><input id="l" className="input" required value={f.licence} onChange={set("licence")} /></div>
          <div><label className="label" htmlFor="x">Licence expiry</label><input id="x" className="input" type="date" required value={f.expiry} onChange={set("expiry")} /></div>
        </div>
        <button className="btn btn-primary w-full">Submit application</button>
        <p className="text-center text-sm text-muted">Already approved? <Link href="/login" className="font-semibold text-brand">Sign in</Link></p>
      </form></Pending>
    </div>
  );
}
