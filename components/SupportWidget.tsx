"use client";
import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { Headset, MessageCircle, Phone, Send, X } from "lucide-react";
import { SUPPORT, pretty } from "@/lib/format";
import { useAuth } from "./AuthProvider";

const TOPICS = ["Track my order", "Prescription help", "Payment problem", "Speak to a pharmacist", "Delivery question"];

/**
 * Immediate-response support: the panel replies instantly and hands the
 * conversation to WhatsApp / phone (both staffed 24/7). There is no in-app
 * chat backend yet — see README.
 */
export function SupportWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(true);
  const panel = useRef<HTMLDivElement>(null);
  const fab = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    setTyping(true);
    if (panel.current) {
      animate(panel.current, { translateY: [30, 0], opacity: [0, 1], scale: [0.95, 1], duration: 500, ease: "outExpo" });
      animate(panel.current.querySelectorAll("[data-pop]"), { translateY: [12, 0], opacity: [0, 1], delay: stagger(70, { start: 250 }), duration: 450, ease: "outQuad" });
    }
    const t = setTimeout(() => setTyping(false), 700);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!fab.current) return;
    const a = animate(fab.current, { scale: [1, 1.08, 1], duration: 1800, loop: true, ease: "inOutSine", loopDelay: 3500 });
    return () => { a.pause(); };
  }, []);

  const wa = (text: string) => {
    const hello = user ? `Hi Top-Up, this is ${user.name} (${user.email}). ` : "Hi Top-Up, ";
    window.open(`https://wa.me/${SUPPORT.whatsapp}?text=${encodeURIComponent(hello + text)}`, "_blank", "noopener");
  };

  return (
    <>
      {open && (
        <div ref={panel} role="dialog" aria-label="Contact support" className="fixed bottom-24 right-3 z-[60] w-[calc(100vw-1.5rem)] max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5 sm:bottom-24 sm:right-6">
          <div className="hero-gradient flex items-center gap-3 px-5 py-4">
            <span className="relative grid size-11 place-items-center rounded-full bg-white text-brand"><Headset size={20} /><span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" /></span>
            <div className="flex-1"><p className="font-bold leading-tight text-white">Customer support</p><p className="text-xs text-white/80">Online 24/7 · replies right away</p></div>
            <button onClick={() => setOpen(false)} aria-label="Close support" className="rounded-full p-2 text-white hover:bg-white/20"><X size={18} /></button>
          </div>
          <div className="space-y-3 p-5">
            <div data-pop className="max-w-[85%] rounded-2xl rounded-tl-md bg-mist px-4 py-3 text-sm">
              {typing ? <span className="flex gap-1 py-1" aria-label="typing">{[0, 1, 2].map((i) => <i key={i} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 120}ms` }} />)}</span>
                : <>Hi{user ? ` ${user.name.split(" ")[0]}` : ""}! 👋 A pharmacist is on hand right now. Pick a topic or message us — we&apos;ll answer straight away.</>}
            </div>
            <div data-pop className="flex flex-wrap gap-2">
              {TOPICS.map((t) => <button key={t} onClick={() => wa(`I need help: ${t}.`)} className="rounded-full border border-peri px-3 py-1.5 text-xs font-semibold hover:bg-mist">{t}</button>)}
            </div>
            <form data-pop onSubmit={(e) => { e.preventDefault(); if (msg.trim()) { wa(msg.trim()); setMsg(""); } }} className="flex gap-2">
              <input value={msg} onChange={(e) => setMsg(e.target.value)} className="input !py-3" placeholder="Type your message…" aria-label="Your message" />
              <button className="btn btn-primary !px-4" aria-label="Send on WhatsApp"><Send size={16} /></button>
            </form>
            <div data-pop className="grid grid-cols-2 gap-2">
              <a href={`https://wa.me/${SUPPORT.whatsapp}`} target="_blank" rel="noopener" className="btn bg-[#25D366] !py-2.5 text-white"><MessageCircle size={16} /> WhatsApp</a>
              <a href={`tel:+${SUPPORT.phone}`} className="btn btn-soft !py-2.5"><Phone size={16} /> Call now</a>
            </div>
            <p data-pop className="text-center text-xs text-muted">Hotline {pretty(SUPPORT.phone)} · {pretty(SUPPORT.phone2)}</p>
          </div>
        </div>
      )}
      <button ref={fab} onClick={() => setOpen((o) => !o)} aria-label={open ? "Close support" : "Contact support"} aria-expanded={open}
        className="fixed bottom-5 right-3 z-[60] flex items-center gap-2 rounded-full bg-deep px-5 py-4 font-semibold text-white shadow-2xl transition hover:bg-sky sm:right-6">
        {open ? <X size={20} /> : <Headset size={20} />}<span className="hidden sm:inline">{open ? "Close" : "Need help?"}</span>
      </button>
    </>
  );
}
