"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, ChevronRight, MapPin } from "lucide-react";
import { Img } from "./Img";
import { CountUp } from "./CountUp";

export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-char]", { yPercent: 115, duration: 1.3, stagger: 0.05 })
        .from("[data-person]", { xPercent: 12, opacity: 0, duration: 1.3 }, "-=1")
        .from("[data-hero-fade]", { y: 26, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.9")
        .from("[data-float]", { y: 40, opacity: 0, scale: 0.92, duration: 1 }, "-=0.9");
      gsap.to("[data-float]", { y: "-=8", duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="px-3 sm:px-5">
      <div className="hero-gradient relative min-h-[540px] overflow-hidden rounded-[30px] sm:min-h-[600px] lg:min-h-[640px]">
        <h1 className="pointer-events-none absolute left-[3%] top-[4%] z-20 select-none text-[clamp(3.4rem,14.2vw,13.5rem)] font-extrabold leading-[0.95] tracking-[-0.06em] text-white" aria-label="Pharmacy">
          {"Pharmacy".split("").map((c, i) => <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top"><span data-char className="inline-block">{c}</span></span>)}
        </h1>

        <div data-person className="absolute bottom-0 right-[-14%] z-10 h-[74%] w-[80%] sm:right-0 sm:h-[90%] sm:w-[46%] lg:w-[38%]">
          <Img k="hero" w={1000} priority alt="Top-Up pharmacist" className="hero-person size-full object-cover object-top mix-blend-multiply" />
        </div>

        <div data-float className="absolute bottom-5 left-5 z-20 w-[210px] rounded-[24px] bg-white p-4 shadow-xl sm:bottom-8 sm:left-8 sm:w-[250px] sm:p-5">
          <div className="flex items-center justify-between"><span className="text-sm font-semibold">Pharmacy hours</span><span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold">Always</span></div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted"><span className="grid size-8 place-items-center rounded-full bg-mist"><MapPin size={14} /></span><span className="flex-1 font-medium text-ink">Tema · Accra · Kumasi</span><ChevronRight size={14} /></div>
          <p className="mt-3 text-5xl font-extrabold leading-none tracking-tighter sm:text-6xl"><CountUp to={24} /><span className="text-lg font-medium text-muted">/7</span></p>
        </div>

        <div className="absolute bottom-6 left-[52%] z-20 hidden max-w-[260px] space-y-4 lg:block xl:left-[40%]">
          <p data-hero-fade className="text-sm font-medium leading-snug text-white">Quality healthcare products from a leading retail and wholesale pharmaceutical company — whatever you need, 24/7.</p>
          <Link data-hero-fade href="/shop" className="btn btn-white shadow-lg">Shop Now <ArrowUpRight size={15} /></Link>
        </div>
        <Link href="/shop" className="btn btn-white absolute bottom-5 right-5 z-20 shadow-lg lg:hidden">Shop Now <ArrowUpRight size={15} /></Link>
      </div>
    </section>
  );
}
