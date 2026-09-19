"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Fades/slides children in once as they scroll into view (children stay visible without JS or with reduced motion). */
export function Reveal({ children, className = "", delay = 0, y = 36, stagger = 0 }:
  { children: React.ReactNode; className?: string; delay?: number; y?: number; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(stagger ? el.children : el, {
        y, opacity: 0, duration: 0.9, delay, stagger, ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y, stagger]);
  return <div ref={ref} className={className}>{children}</div>;
}
