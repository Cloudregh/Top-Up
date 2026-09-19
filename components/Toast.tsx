"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { animate } from "animejs";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface T { id: number; text: string; tone: "ok" | "err" }
const Ctx = createContext<(text: string, tone?: T["tone"]) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<T[]>([]);
  const n = useRef(0);
  const push = useCallback((text: string, tone: T["tone"] = "ok") => {
    const id = ++n.current;
    setItems((x) => [...x, { id, text, tone }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-70 flex flex-col items-center gap-2 px-4 sm:bottom-6" aria-live="polite">
        {items.map((t) => <ToastItem key={t.id} t={t} />)}
      </div>
    </Ctx.Provider>
  );
}

function ToastItem({ t }: { t: T }) {
  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el) animate(el, { translateY: [24, 0], opacity: [0, 1], scale: [0.96, 1], duration: 450, ease: "outExpo" });
  }, []);
  const Icon = t.tone === "ok" ? CheckCircle2 : AlertCircle;
  return (
    <div ref={ref} role="status" className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-xl">
      <Icon size={18} className={t.tone === "ok" ? "text-emerald-300" : "text-rose-300"} /> {t.text}
    </div>
  );
}
