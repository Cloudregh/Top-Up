"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Img } from "./Img";
import { Pending } from "./Pending";

const Star = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden {...props}><path fill="currentColor" d="M12 0c.6 6.6 4.9 11.4 12 12-7.1.6-11.4 5.4-12 12C11.4 17.4 7.1 12.6 0 12 7.1 11.4 11.4 6.6 12 0Z" /></svg>
);

export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, onComplete: () => { gsap.set("[data-charwrap]", { overflow: "visible" }); } });
      tl.from("[data-char]", { yPercent: 115, duration: 1.3, stagger: 0.05 })
        .from("[data-mark]", { scale: 0.6, rotate: -25, opacity: 0, duration: 1.2 }, "-=1")
        .from("[data-person]", { y: 70, opacity: 0, duration: 1.2 }, "-=1.05")
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.8")
        .from("[data-card]", { y: 40, opacity: 0, scale: 0.94, duration: 1 }, "-=0.9");
      gsap.to("[data-card]", { y: "-=7", duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to("[data-mark]", { rotate: 8, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to("[data-star]", { rotate: 90, duration: 6, ease: "none", repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <Pending waitingFor="settings: branches + opening hours">
      <section ref={root} className="gutter pt-4 sm:pt-6">
        <div className="hero-soft relative h-135 overflow-hidden rounded-[30px] sm:h-[clamp(540px,46vw,780px)]">
          {/* giant wordmark */}
          <h1 className="pointer-events-none absolute left-[2.5%] top-[2%] z-10 select-none text-[clamp(3.4rem,14.8vw,16rem)] font-extrabold leading-none tracking-[-0.04em] text-white" aria-label="Pharmacy">
            {"Pharmacy".split("").map((c, i) => (
              <span key={i} data-charwrap className="relative mb-[-0.2em] ml-[-0.08em] mr-[-0.18em] inline-block overflow-hidden pb-[0.34em] pl-[0.08em] pr-[0.18em] align-top">
                <span data-char className="relative inline-block">{c}</span>
                {i === 0 && <Star data-star className="absolute left-[0.35em] top-[0.335em] size-[0.13em] text-white" />}
              </span>
            ))}
          </h1>

          {/* Top-Up mark as the translucent brand shape */}
          <div data-mark aria-hidden className="absolute right-[3%] top-[5%] z-0 aspect-square w-[24%] bg-white/45 sm:w-[19%]"
            style={{ WebkitMask: "url(/logo-mark-v2.png) center / contain no-repeat", mask: "url(/logo-mark-v2.png) center / contain no-repeat" }} />

          {/* person (cut-out) overlaps the wordmark */}
          <div data-person className="absolute bottom-0 right-[-10%] z-20 h-[62%] sm:right-[1%] sm:h-[72%] lg:h-[84%]">
            <Img k="hero_cutout" w={1000} priority alt="Top-Up pharmacist" className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_20px_30px_rgba(1,37,147,0.18)]" />
          </div>

          {/* info card */}
          <div data-card className="absolute bottom-5 left-5 z-30 w-50 rounded-[22px] bg-white p-4 shadow-xl sm:bottom-[8%] sm:left-[3.5%] sm:w-62.5 sm:p-5">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold">Pharmacy hours</span><span className="rounded-full bg-[#dff1e4] px-3 py-1 text-xs font-bold text-leaf">Open</span></div>
            <div className="mt-3 flex items-center gap-2.5 text-xs">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist"><span className="size-5 bg-brand" style={{ WebkitMask: "url(/logo-mark-v2.png) center / contain no-repeat", mask: "url(/logo-mark-v2.png) center / contain no-repeat" }} /></span>
              <span className="flex-1 font-medium">Tema · Accra · Kumasi</span><ChevronRight size={14} />
            </div>
            <div className="mt-3 flex items-end justify-between">
              <p className="text-5xl font-medium leading-none tracking-tighter sm:text-6xl">24/7<span className="ml-1 text-sm font-normal text-muted">/open</span></p>
              <span className="mb-1 flex flex-col gap-1.5" aria-hidden><i className="size-1.5 rounded-full bg-ink/20" /><i className="size-1.5 rounded-full bg-ink" /><i className="size-1.5 rounded-full bg-ink/20" /></span>
            </div>
          </div>

          {/* description + CTA */}
          <div className="absolute left-5 top-[40%] z-30 max-w-[46%] space-y-4 sm:left-[3.5%] sm:top-[33%] sm:max-w-62.5 lg:left-[31%] lg:top-auto lg:bottom-[9%]">
            <p data-hero-fade className="text-xs font-semibold leading-snug text-white [text-shadow:0_1px_8px_rgba(1,37,147,.35)] sm:text-[13px]">Quality healthcare products from a leading retail and wholesale pharmaceutical company whatever you need, 24/7.</p>
            <Link data-hero-fade href="/shop" className="btn btn-white shadow-md">Shop Now <ArrowUpRight size={15} /></Link>
          </div>
        </div>
      </section>
    </Pending>
  );
}
