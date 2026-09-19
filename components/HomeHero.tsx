"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Clock, FileText, Pill, Sparkles, Truck } from "lucide-react";
import { CountUp } from "./CountUp";

export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-word]", { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.06 })
        .from("[data-hero-fade]", { y: 28, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.7")
        .from("[data-float]", { scale: 0.85, y: 40, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.9");
      gsap.to("[data-float]", { y: "+=12", duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.4 });
      gsap.to("[data-spin]", { rotate: 360, duration: 40, ease: "none", repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="container-x pt-4">
      <div className="card p-3 sm:p-4">
        <div className="hero-gradient relative min-h-[560px] overflow-hidden rounded-[24px] p-6 sm:p-10 lg:min-h-[620px]">
          <Sparkles data-spin className="absolute -right-10 -top-10 size-64 text-white/40 sm:size-96" strokeWidth={1} />
          <h1 className="relative select-none text-[clamp(3.6rem,15vw,11rem)] font-extrabold leading-[0.9] tracking-tighter text-white">
            {"Pharmacy".split("").map((c, i) => <span key={i} className="inline-block overflow-hidden align-top"><span data-word className="inline-block">{c}</span></span>)}
          </h1>
          <div className="relative mt-6 max-w-md space-y-5">
            <p data-hero-fade className="text-lg font-medium text-ink/80">Medicines, prescriptions and everyday care from Top-Up — order online, delivered to your home or office, open 24/7.</p>
            <div data-hero-fade className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-white shadow-lg">Shop now <ArrowUpRight size={16} /></Link>
              <Link href="/prescriptions" className="btn bg-ink/90 text-white hover:bg-ink"><FileText size={16} /> Upload prescription</Link>
            </div>
          </div>

          <div data-float className="card absolute bottom-6 right-6 hidden w-60 p-5 sm:block lg:bottom-10 lg:right-auto lg:left-[52%]">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold">Always open</span><span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold">24/7</span></div>
            <p className="mt-4 text-6xl font-extrabold tracking-tighter"><CountUp to={24} /><span className="text-xl text-muted">hrs</span></p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted"><Clock size={13} /> Pharmacist on hand, day and night</p>
          </div>
          <div data-float className="card absolute right-6 top-40 hidden items-center gap-3 p-4 lg:flex">
            <span className="grid size-11 place-items-center rounded-full bg-mist text-brand"><Truck size={20} /></span>
            <div><p className="text-sm font-bold">Home & office delivery</p><p className="text-xs text-muted">Track it live</p></div>
          </div>
          <Pill data-float className="absolute bottom-8 left-1/2 hidden size-24 -rotate-12 text-white/70 lg:block" strokeWidth={1.2} />
        </div>
      </div>
    </section>
  );
}
