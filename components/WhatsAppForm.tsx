"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { SUPPORT } from "@/lib/format";

/** Enquiry form that hands the details to the team on WhatsApp (no forms backend yet). */
export function WhatsAppForm({ heading, fields, cta = "Send on WhatsApp" }: { heading: string; fields: { name: string; label: string; type?: string; options?: string[]; textarea?: boolean }[]; cta?: string }) {
  const [v, setV] = useState<Record<string, string>>({});
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV({ ...v, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `${heading}\n${fields.map((f) => `${f.label}: ${v[f.name] ?? ""}`).join("\n")}`;
    window.open(`https://wa.me/${SUPPORT.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  return (
    <form onSubmit={submit} className="tile space-y-4 p-6 sm:p-8">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.textarea ? "sm:col-span-2" : ""}>
            <label className="label" htmlFor={f.name}>{f.label}</label>
            {f.options ? <select id={f.name} required className="input !bg-white" value={v[f.name] ?? ""} onChange={set(f.name)}><option value="" disabled>Select…</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
              : f.textarea ? <textarea id={f.name} className="input min-h-24 !bg-white" value={v[f.name] ?? ""} onChange={set(f.name)} />
              : <input id={f.name} type={f.type ?? "text"} required className="input !bg-white" value={v[f.name] ?? ""} onChange={set(f.name)} />}
          </div>
        ))}
      </div>
      <button className="btn w-full bg-[#25D366] text-white hover:opacity-90"><MessageCircle size={18} /> {cta}</button>
    </form>
  );
}
