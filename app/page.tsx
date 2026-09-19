"use client";
import Link from "next/link";
import { ArrowUpRight, Award, Clock, FileText, Stethoscope } from "lucide-react";
import { HomeHero } from "@/components/HomeHero";
import { Reveal } from "@/components/Reveal";
import { Img } from "@/components/Img";
import { Carousel } from "@/components/Carousel";
import { Faq } from "@/components/Faq";
import { ProductCard } from "@/components/ProductCard";
import { ErrorState, Skeleton } from "@/components/States";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/Toast";
import { useCatalogue, useFetch } from "@/lib/hooks";
import { AWARDS, FAQS, INSURERS, SERVICES } from "@/lib/site";
import type { CatalogueItem, CustomerOrder, Page } from "@/lib/types";

const H2 = "text-3xl font-semibold leading-tight tracking-tight sm:text-5xl";
const SeeMore = ({ href = "/shop" }: { href?: string }) => <Link href={href} className="btn btn-white shrink-0 shadow-sm ring-1 ring-black/5">See more <ArrowUpRight size={15} /></Link>;

function Grid({ items, preview, loading, error, retry, n }: { items: CatalogueItem[]; preview: boolean; loading: boolean; error: { title: string; detail?: string } | null; retry: () => void; n: number }) {
  if (error) return <ErrorState title="Couldn't load products" detail={error.detail || error.title} onRetry={retry} />;
  if (loading) return <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: n }, (_, i) => <Skeleton key={i} className="h-80" />)}</div>;
  return <Reveal stagger={0.07} className="grid grid-cols-2 gap-4 lg:grid-cols-4">{items.slice(0, n).map((p) => <ProductCard key={p.product_id} item={p} preview={preview} />)}</Reveal>;
}

export default function HomePage() {
  const { status } = useAuth();
  const cat = useCatalogue("", "", 16);
  const offer = cat.items.slice(0, 8);
  const sellers = cat.items.length > 8 ? cat.items.slice(8, 16) : cat.items.slice(0, 8);

  return (
    <>
      <HomeHero />

      {status === "authed" && <ReorderUsuals />}

      {/* Today's best offer */}
      <section className="mt-14 gutter">
        <Reveal className="flex items-end justify-between gap-4"><h2 className={H2}>Today&apos;s Best Offer<br />Just For You</h2><SeeMore /></Reveal>
        {cat.preview && <p className="mt-4 rounded-2xl bg-mist px-4 py-3 text-sm text-muted">You&apos;re browsing a preview. <Link href="/login" className="font-semibold text-brand underline">Sign in</Link> to see live stock and your own price.</p>}
        <div className="mt-8">
          {cat.error ? <ErrorState title="Couldn't load products" detail={cat.error.detail || cat.error.title} onRetry={cat.retry} />
            : cat.loading ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-80" />)}</div>
            : <Carousel>{offer.map((p) => <ProductCard key={p.product_id} item={p} preview={cat.preview} />)}</Carousel>}
        </div>
      </section>

      {/* Campaigns (Mecura "Seasonal Exclusive Solutions") */}
      <section className="mt-24 gutter">
        <Reveal><h2 className={`${H2} text-center`}>Health Campaigns<br />&amp; Everyday Solutions</h2></Reveal>
        <Reveal stagger={0.1} className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { t: "Kick that cough away", s: "Cough, cold & flu care", k: "cat_cough", q: "cough" },
            { t: "Fast pain relief", s: "Headache, body & muscle pain", k: "season_pain", q: "pain" },
            { t: "Early detection saves lives", s: "Breast Cancer Awareness Month — mammograms catch it early", k: "season_early", q: "" },
          ].map((c) => (
            <Link key={c.t} href={c.q ? `/shop?q=${c.q}` : "/appointment"} className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] md:aspect-[3/4]">
              <Img k={c.k as "cat_cough"} w={700} h={900} alt={c.t} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#012060]/65 via-[#012060]/5 to-[#012060]/75" />
              <div className="absolute inset-x-0 top-0 p-5"><p className="max-w-[12rem] text-lg font-semibold leading-tight text-white drop-shadow">{c.t}</p></div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5"><p className="max-w-[12rem] text-xs text-white/90">{c.s}</p><span className="btn btn-white !px-4 !py-2 text-xs">See more <ArrowUpRight size={13} /></span></div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* Best sellers */}
      <section className="mt-24 gutter">
        <Reveal><h2 className={`${H2} text-center`}>Our Best Seller Products</h2></Reveal>
        <div className="mt-10"><Grid items={sellers} preview={cat.preview} loading={cat.loading} error={cat.error} retry={cat.retry} n={8} /></div>
        <div className="mt-8 flex justify-center"><SeeMore /></div>
      </section>

      {/* Consult cards (Mecura doctor cards) */}
      <section className="mt-24 gutter">
        <Reveal stagger={0.12} className="grid gap-4 md:grid-cols-2">
          <div className="relative flex min-h-[280px] overflow-hidden rounded-[28px] bg-deep p-7 text-white">
            <div className="z-10 flex max-w-[55%] flex-col justify-between"><div><p className="text-xl font-semibold">Book an Appointment</p><p className="mt-2 text-xs text-white/70">Visit any of our branches and receive appropriate care specific to your health needs.</p></div>
              <Link href="/appointment" className="btn mt-6 w-fit bg-sky text-white hover:opacity-90">Book an appointment <ArrowUpRight size={14} /></Link></div>
            <Img k="consult_appointment" w={600} h={700} alt="Pharmacist" className="absolute bottom-0 right-0 h-full w-[46%] rounded-l-[28px] object-cover object-top" />
          </div>
          <div className="tile relative flex min-h-[280px] overflow-hidden p-7">
            <div className="z-10 flex max-w-[55%] flex-col justify-between"><div><p className="text-xl font-semibold">Order your prescription medications</p><p className="mt-2 text-xs text-muted">Upload it once; a pharmacist reviews it and you order once approved.</p></div>
              <Link href="/prescriptions" className="btn btn-white mt-6 w-fit shadow-sm ring-1 ring-black/5"><FileText size={14} /> Prescriptions</Link></div>
            <Img k="consult_prescription" w={600} h={700} alt="Pharmacist with stethoscope" className="absolute bottom-0 right-0 h-full w-[46%] rounded-l-[28px] object-cover object-top" />
          </div>
        </Reveal>
      </section>

      {/* Services + insurers */}
      <section id="services" className="mt-24 scroll-mt-28 gutter">
        <Reveal className="flex items-end justify-between gap-4"><h2 className={H2}>Pharmacy Services</h2><SeeMore href="/services" /></Reveal>
        <Reveal stagger={0.05} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.t} className="tile p-5 transition hover:-translate-y-1"><span className="grid size-10 place-items-center rounded-full bg-white text-brand"><Stethoscope size={18} /></span><h3 className="mt-4 text-sm font-semibold">{s.t}</h3><p className="mt-1 text-xs leading-relaxed text-muted">{s.d}</p></div>
          ))}
        </Reveal>
        <Reveal className="mt-10 text-center"><p className="text-sm font-semibold">Insurance partners</p><div className="mt-4 flex flex-wrap justify-center gap-2">{INSURERS.map((i) => <span key={i} className="rounded-full bg-mist px-4 py-2 text-xs font-semibold">{i}</span>)}</div></Reveal>
      </section>

      {/* Awards (Mecura reviews row) */}
      <section className="mt-24 gutter">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={H2}>Award-winning care,<br />trusted across Ghana</h2>
          <p className="max-w-[220px] text-xs text-muted">Recognised by customers, insurers, suppliers and the Ghana College of Pharmacists.</p>
        </Reveal>
        <div className="mt-8"><Carousel arrows itemClass="w-[82%] sm:w-[44%] lg:w-[31%]">
          {AWARDS.map((a) => (
            <div key={a.t} className="tile flex h-full min-h-[190px] flex-col justify-between p-6">
              <div className="flex items-center gap-1 text-amber-500">{Array.from({ length: 5 }, (_, i) => <Award key={i} size={15} />)}</div>
              <p className="mt-4 text-lg font-semibold leading-snug">{a.t}</p>
              <p className="mt-3 text-xs text-muted">{a.by}</p>
            </div>
          ))}
        </Carousel></div>
      </section>

      {/* Delivery banner */}
      <section className="mt-24 gutter">
        <Reveal className="hero-gradient relative flex min-h-[300px] items-center overflow-hidden rounded-[30px] p-8 sm:p-14">
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">Home &amp; office delivery, your way</h2>
            <p className="mt-4 text-sm text-white/90">Choose from a number of delivery options available — and track your order live once it&apos;s dispatched.</p>
            <Link href="/shop" className="btn btn-white mt-6 shadow-lg">Order Now</Link>
          </div>
          <Img k="delivery" w={900} h={700} alt="Delivery rider" className="absolute bottom-0 right-0 hidden h-full w-[46%] object-cover object-top sm:block" style={{ maskImage: "linear-gradient(to right, transparent, #000 35%)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 35%)" }} />
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mt-24 gutter">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <Reveal><h2 className={H2}>Frequently Asked<br />Questions</h2><p className="mt-4 max-w-xs text-sm text-muted">Our team of experienced pharmacists is here to provide personalised guidance and support.</p><Link href="/faq" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">See more FAQ <ArrowUpRight size={14} /></Link></Reveal>
          <Reveal><Faq items={FAQS} /></Reveal>
        </div>
        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-muted"><Clock size={13} /> Open 24/7 · Tema · Accra · Kumasi</p>
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
    <section className="mt-16 gutter">
      <Reveal className="tile flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div><h2 className="text-2xl font-semibold">Reorder your usuals</h2><p className="mt-1 text-sm text-muted">{lines.map(({ l, p }) => `${l.quantity}× ${p!.name}`).join(" · ")}</p></div>
        <button className="btn btn-primary" onClick={() => { lines.forEach(({ l, p }) => cart.add(p!, l.quantity)); toast("Added to your cart"); }}>Add all to cart</button>
      </Reveal>
    </section>
  );
}
