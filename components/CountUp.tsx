"use client";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = { v: 0 };
    const a = animate(o, { v: to, duration: 1600, ease: "outExpo", onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
    return () => { a.pause(); };
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}
