"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, FileText, Link2, Loader2, Upload, XCircle } from "lucide-react";
import { Empty, Skeleton } from "@/components/States";
import { useToast } from "@/components/Toast";
import { api, errInfo } from "@/lib/api";
import { useRequireAuth } from "@/lib/hooks";
import { prescriptionIds } from "@/lib/local";
import { fmtDate, shortId } from "@/lib/format";
import type { Prescription } from "@/lib/types";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAX_MB = 10;

const STATUS = {
  pending: { icon: Clock, cls: "bg-amber-50 text-amber-700", label: "Pending review" },
  approved: { icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700", label: "Approved" },
  rejected: { icon: XCircle, cls: "bg-rose-50 text-rose-700", label: "Rejected" },
} as const;

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData(); fd.append("file", file); fd.append("upload_preset", PRESET!);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error("The file upload failed. Please try again.");
  return (await res.json()).secure_url as string;
}

export default function PrescriptionsPage() {
  const authed = useRequireAuth();
  const toast = useToast();
  const [list, setList] = useState<Prescription[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [url, setUrl] = useState(""); const [formErr, setFormErr] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const canUpload = !!CLOUD && !!PRESET;

  const load = async () => {
    const rs = await Promise.allSettled(prescriptionIds.get().map((id) => api<Prescription>(`/prescriptions/${id}`)));
    setList(rs.flatMap((r) => (r.status === "fulfilled" ? [r.value] : [])));
  };
  useEffect(() => { if (authed) load(); }, [authed]);
  // Keep pending ones fresh so approval shows up without a reload.
  const anyPending = list?.some((p) => p.status === "pending");
  useEffect(() => { if (!anyPending) return; const t = setInterval(load, 8000); return () => clearInterval(t); }, [anyPending]);

  async function submit(fileUrl: string) {
    const p = await api<Prescription>("/prescriptions", { method: "POST", body: { file_url: fileUrl } });
    prescriptionIds.add(p.id); await load(); toast("Prescription sent to our pharmacists");
  }
  async function onFile(f?: File) {
    if (!f) return; setFormErr("");
    if (!/^(image\/|application\/pdf)/.test(f.type)) return setFormErr("Please choose a photo or a PDF.");
    if (f.size > MAX_MB * 1024 * 1024) return setFormErr(`That file is over ${MAX_MB}MB.`);
    setBusy(true);
    try { await submit(await uploadToCloudinary(f)); } catch (e) { setFormErr(errInfo(e).detail || errInfo(e).title); } finally { setBusy(false); if (file.current) file.current.value = ""; }
  }
  async function onUrl(e: React.FormEvent) {
    e.preventDefault(); setFormErr(""); setBusy(true);
    try { await submit(url.trim()); setUrl(""); } catch (x) { setFormErr(errInfo(x).detail || errInfo(x).title); } finally { setBusy(false); }
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Prescriptions</h1>
      <p className="mt-2 max-w-xl text-muted">Upload a photo or PDF of your prescription. Once a pharmacist approves it you can order controlled medicines.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
        <section className="card h-fit space-y-4 p-6">
          {canUpload ? (
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
              className={`grid place-items-center gap-3 rounded-[24px] border-2 border-dashed p-8 text-center transition ${drag ? "border-brand bg-mist" : "border-peri"}`}>
              {busy ? <Loader2 className="animate-spin text-brand" size={32} /> : <Upload className="text-brand" size={32} />}
              <p className="font-semibold">{busy ? "Uploading…" : "Drop your prescription here"}</p>
              <input ref={file} type="file" accept="image/*,application/pdf" capture="environment" className="sr-only" id="rx-file" onChange={(e) => onFile(e.target.files?.[0])} />
              <label htmlFor="rx-file" className="btn btn-primary cursor-pointer">Choose photo or PDF</label>
              <p className="text-xs text-muted">JPG, PNG or PDF · up to {MAX_MB}MB</p>
            </div>
          ) : (
            <form onSubmit={onUrl} className="space-y-3">
              <p className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-900">File upload isn&apos;t configured yet (Cloudinary keys missing). For now, paste a link to your uploaded prescription.</p>
              <label className="label" htmlFor="u">Link to prescription file</label>
              <div className="flex items-center gap-2"><Link2 size={18} className="text-muted" /><input id="u" className="input" type="url" required placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
              <button className="btn btn-primary w-full" disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" />} Send for review</button>
            </form>
          )}
          {formErr && <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-800">{formErr}</p>}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">Your prescriptions</h2>
          {list === null ? <Skeleton className="h-28" /> : !list.length ? <Empty title="No prescriptions yet" hint="Upload one to get started." /> : list.map((p) => {
            const s = STATUS[p.status]; const I = s.icon;
            return (
              <div key={p.id} className="card flex flex-wrap items-start gap-4 p-5">
                <span className="grid size-12 place-items-center rounded-2xl bg-mist text-brand"><FileText /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">Prescription {shortId(p.id)}</p><p className="text-sm text-muted">Sent {fmtDate(p.created_at, true)}</p>
                  {p.note && <p className="mt-2 rounded-2xl bg-mist p-3 text-sm"><b>Pharmacist&apos;s note:</b> {p.note}</p>}
                  {p.status === "rejected" && <p className="mt-2 text-sm text-muted">Please upload a clearer or updated prescription, or tap <b>Need help?</b> to speak to a pharmacist.</p>}
                  {p.status === "approved" && <Link href="/shop" className="mt-2 inline-block text-sm font-semibold text-brand underline">Shop prescription items</Link>}
                </div>
                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}><I size={14} />{s.label}</span>
              </div>);
          })}
        </section>
      </div>
    </div>
  );
}
