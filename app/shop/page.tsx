"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { PlaceholderProducts } from "@/components/PlaceholderProducts";
import { Pending } from "@/components/Pending";
import { Empty, ErrorState, Skeleton } from "@/components/States";
import { Reveal } from "@/components/Reveal";
import { useCatalogue } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/format";

function Shop() {
  const sp = useSearchParams(); const router = useRouter();
  const category = sp.get("category") || "";
  const [text, setText] = useState(sp.get("q") || "");
  const [q, setQ] = useState(text);
  const input = useRef<HTMLInputElement>(null);
  const { items, loading, error, gated, hasMore, more, retry } = useCatalogue(q, category, 12);

  useEffect(() => { const t = setTimeout(() => setQ(text.trim()), 350); return () => clearTimeout(t); }, [text]);
  useEffect(() => { if (sp.get("focus")) input.current?.focus(); }, [sp]);

  const setCat = (c: string) => router.replace(c ? `/shop?category=${c}` : "/shop", { scroll: false });

  return (
    <div className="container-x py-8">
      <Reveal><h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Shop</h1></Reveal>
      <div className="card mt-6 flex items-center gap-3 px-5 py-3">
        <Search className="text-muted" size={20} />
        <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder="Search medicines & health needs" aria-label="Search products" className="w-full bg-transparent py-2 outline-none" />
        {text && <button onClick={() => setText("")} aria-label="Clear search" className="rounded-full p-1 hover:bg-mist"><X size={18} /></button>}
      </div>
      <Pending waitingFor="GET /catalogue/categories (chips are guesses at products.form)"><div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Categories">
        {[{ value: "", label: "All" }, ...CATEGORIES].map((c) => (
          <button key={c.value} role="tab" aria-selected={category === c.value} onClick={() => setCat(c.value)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${category === c.value ? "bg-ink text-white" : "bg-white hover:bg-mist"}`}>{c.label}</button>
        ))}
      </div></Pending>

      <div className="mt-6">
        {gated ? <PlaceholderProducts n={8} cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
          : error && !items.length ? <ErrorState title="Couldn't load the catalogue" detail={error.detail || error.title} onRetry={retry} />
          : loading && !items.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-72" />)}</div>
          : !items.length ? <Empty title="No products found" hint="Try a different search or category." action={<button className="btn btn-primary" onClick={() => { setText(""); setCat(""); }}>Clear filters</button>} />
          : <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.product_id} item={p} />)}</div>
            {error && <p role="alert" className="mt-4 text-center text-sm text-rose-600">{error.title}. <button className="underline" onClick={more}>Retry</button></p>}
            {hasMore && <div className="mt-8 text-center"><button className="btn btn-white shadow" onClick={more} disabled={loading}>{loading && <Loader2 size={16} className="animate-spin" />} Load more</button></div>}
          </>}
      </div>
    </div>
  );
}
export default function ShopPage() { return <Suspense><Shop /></Suspense>; }
