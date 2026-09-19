"use client";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { ErrorState, Skeleton } from "@/components/States";
import { useFetch, useRequireAuth } from "@/lib/hooks";
import { useProducts } from "@/lib/orders";
import { fmtDate, ghs, shortId } from "@/lib/format";
import type { Invoice } from "@/lib/types";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const authed = useRequireAuth();
  const { data: inv, error, loading, retry } = useFetch<Invoice>(authed ? `/invoices/${id}` : null);
  const product = useProducts(inv?.lines.map((l) => l.product_id) ?? []);

  if (!authed || loading) return <div className="container-x py-8"><Skeleton className="h-96" /></div>;
  if (error) return <div className="container-x py-8"><ErrorState title="Invoice unavailable" detail={error.detail || error.title} onRetry={retry} /></div>;
  if (!inv) return null;

  return (
    <div className="container-x max-w-3xl py-8">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm font-semibold text-muted"><ArrowLeft size={16} /> Back</Link>
        <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16} /> Print / save PDF</button>
      </div>
      <div className="card p-8 print:shadow-none">
        <div className="flex justify-between"><div><p className="text-2xl font-bold">Top-Up <span className="text-leaf">Pharmacy</span></p><p className="text-sm text-muted">Sena House, Hospital Road, Community 9, Tema</p></div>
          <div className="text-right"><p className="text-xl font-bold">Invoice</p><p className="text-sm text-muted">#{shortId(inv.id)}</p><p className="text-sm text-muted">{fmtDate(inv.issued_at)}</p></div></div>
        <p className="mt-6 inline-block rounded-full bg-mist px-3 py-1 text-xs font-semibold capitalize">{inv.status.replace("_", " ")}</p>
        <table className="mt-4 w-full text-sm"><thead><tr className="border-b border-mist text-left text-xs text-muted"><th className="py-2">Item</th><th>Qty</th><th className="text-right">Unit</th><th className="text-right">Total</th></tr></thead>
          <tbody className="divide-y divide-mist">{inv.lines.map((l, i) => <tr key={i}><td className="py-3">{product(l.product_id)?.name ?? "Product"}</td><td>{l.quantity}</td><td className="text-right">{ghs(l.unit_price_pesewa)}</td><td className="text-right font-semibold">{ghs(l.line_total_pesewa)}</td></tr>)}</tbody></table>
        <p className="mt-4 flex justify-between border-t border-mist pt-4 text-lg font-bold"><span>Total</span><span>{ghs(inv.total_pesewa)}</span></p>
      </div>
    </div>
  );
}
