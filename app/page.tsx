"use client";
import Link from "next/link";
import { ArrowUpRight, Baby, Droplets, Dumbbell, FileText, HeartPulse, Home, Pill, Scissors, ShieldCheck, Stethoscope, Syringe, Truck, Users, Tablets, FlaskConical, Sparkles } from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { ErrorState, Skeleton } from "@/components/States";
import { useAuth } from "@/components/AuthProvider";
import { useCatalogue, useFetch } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/format";
import type { CatalogueItem, CustomerOrder, Page } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/Toast";

const ICONS = { pill: Tablets, capsule: Pill, syrup: FlaskConical, cream: Sparkles, drops: Droplets, syringe: Syringe } as const;
const TINTS = ["bg-[#e4e9fb]", "bg-[#f9e3ec]", "bg-[#e3f3e6]", "bg-[#fdf0d9]", "bg-[#e1f1f9]", "bg-[#ece3fa]"];

const SERVICES = [
  { icon: Stethoscope, t: "24hr pharmaceutical care", d: "A pharmacist on hand whenever you need one." },
  { icon: HeartPulse, t: "Basic diagnostics", d: "BP, glucose and more, right at the branch." },
  { icon: Dumbbell, t: "Weight management", d: "Plans and follow-up from our team." },
  { icon: Users, t: "Counselling", d: "Private, professional guidance." },
  { icon: Truck, t: "Home & office delivery", d: "Choose the delivery option that suits you." },
  { icon: ShieldCheck, t: "Medication therapy", d: "Reviews to keep your regimen safe." },
  { icon: Scissors, t: "Cosmetology", d: "Skin and beauty care." },
  { icon: Baby, t: "Mother & child", d: "Pregnancy, baby and child health." },
];
const INSURERS = ["GLICO", "Metropolitan Health", "Phoenix Insurance", "Ace Medical", "Premier Health", "Acacia Health", "GHIC"];

export default function HomePage() {
  const { status } = useAuth();
  const feat = useCatalogue("", "", 8);

  return (
    <>
      <HomeHero />

      <section className="container-x mt-20">
        <Reveal><h2 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">Our popular categories</h2></Reveal>
        <Reveal stagger={0.07} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => {
            const Icon = ICONS[c.icon];
            return (
              <Link key={c.value} href={`/shop?category=${c.value}`} className="group flex flex-col items-center gap-4 rounded-[24px] bg-white p-5 shadow-[0_10px_40px_-18px_rgba(47,63,184,.25)] transition hover:-translate-y-1">
                <span className={`grid size-24 place-items-center rounded-[20px] ${TINTS[i % TINTS.length]} transition group-hover:scale-105`}><Icon size={40} className="text-brand" strokeWidth={1.5} /></span>
                <span className="text-sm font-semibold">{c.label}</span>
              </Link>
            );
          })}
        </Reveal>
      </section>

      {status === "authed" && <ReorderUsuals />}

      <section className="container-x mt-20">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Today&apos;s picks<br />just for you</h2>
          <Link href="/shop" className="btn btn-white shadow">See more <ArrowUpRight size={16} /></Link>
        </Reveal>
        {feat.preview && <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-muted">You&apos;re browsing a preview. <Link href="/login" className="font-semibold text-brand underline">Sign in</Link> to see live stock and your own price.</p>}
        <div className="mt-8">
          {feat.error ? <ErrorState title="Couldn't load products" detail={feat.error.detail || feat.error.title} onRetry={feat.retry} />
            : feat.loading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-72" />)}</div>
            : <Reveal stagger={0.08} className="grid grid-cols-2 gap-4 lg:grid-cols-4">{feat.items.slice(0, 8).map((p) => <ProductCard key={p.product_id} item={p} preview={feat.preview} />)}</Reveal>}
        </div>
      </section>

      <section className="container-x mt-20">
        <Reveal className="hero-gradient grid items-center gap-6 rounded-[32px] p-8 sm:p-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Order your prescription medications</h2>
            <p className="mt-4 max-w-lg text-ink/70">Snap a photo or upload a PDF. A pharmacist reviews it and you&apos;ll see the decision — and their note — right here.</p>
            <Link href="/prescriptions" className="btn btn-white mt-6 shadow-lg"><FileText size={16} /> Upload prescription</Link>
          </div>
          <ol className="space-y-3 text-sm font-semibold">
            {["Upload your prescription", "Pharmacist approves it", "Order & we deliver"].map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 backdrop-blur"><span className="grid size-8 place-items-center rounded-full bg-ink text-white">{i + 1}</span>{s}</li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section id="services" className="container-x mt-20 scroll-mt-28">
        <Reveal><h2 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">Care beyond the counter</h2></Reveal>
        <Reveal stagger={0.06} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ icon: I, t, d }) => (
            <div key={t} className="card p-6 transition hover:-translate-y-1"><span className="grid size-12 place-items-center rounded-2xl bg-mist text-brand"><I size={22} /></span><h3 className="mt-4 font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>
          ))}
        </Reveal>
      </section>

      <section className="container-x mt-20">
        <Reveal className="card p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Insurance partners</h2>
          <p className="mt-2 text-sm text-muted">We work with leading health insurers across Ghana.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">{INSURERS.map((i) => <span key={i} className="rounded-full bg-mist px-5 py-2.5 text-sm font-semibold">{i}</span>)}</div>
        </Reveal>
      </section>

      <section className="container-x mt-20">
        <Reveal className="grid gap-4 md:grid-cols-2">
          <div className="card flex items-start gap-4 p-8"><Home className="mt-1 shrink-0 text-brand" /><div><h3 className="font-bold">Visit a branch</h3><p className="mt-1 text-sm text-muted">Sena House, Hospital Road, Community 9, Tema — near Bethel Hospital. Branches across Tema, Accra and Kumasi (Abuakwa).</p></div></div>
          <div className="rounded-[28px] bg-ink p-8 text-white"><h3 className="font-bold">Need a hand?</h3><p className="mt-1 text-sm text-white/70">Tap the help button in the corner to reach customer service instantly on WhatsApp or by phone.</p></div>
        </Reveal>
      </section>
    </>
  );
}

/** "Reorder your usuals" — most recent order's lines back into the cart. */
function ReorderUsuals() {
  const { data } = useFetch<Page<CustomerOrder>>("/orders?limit=5");
  const cart = useCart(); const toast = useToast();
  const last = data?.data.find((o) => o.status !== "cancelled");
  const { data: items } = useFetch<Page<CatalogueItem>>(last ? "/catalogue?limit=100" : null);
  if (!last || !items) return null;
  const byId = new Map(items.data.map((i) => [i.product_id, i]));
  const lines = last.lines.map((l) => ({ l, p: byId.get(l.product_id) })).filter((x) => x.p);
  if (!lines.length) return null;
  return (
    <section className="container-x mt-20">
      <Reveal className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div><h2 className="text-2xl font-bold">Reorder your usuals</h2><p className="mt-1 text-sm text-muted">{lines.map(({ l, p }) => `${l.quantity}× ${p!.name}`).join(" · ")}</p></div>
        <button className="btn btn-primary" onClick={() => { lines.forEach(({ l, p }) => cart.add(p!, l.quantity)); toast("Added to your cart"); }}>Add all to cart</button>
      </Reveal>
    </section>
  );
}
