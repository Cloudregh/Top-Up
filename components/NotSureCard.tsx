"use client";
import { Headset, Phone } from "lucide-react";
import { openSupport } from "./SupportWidget";
import { SUPPORT, pretty } from "@/lib/format";

/** "Not sure which one is right for you?" — opens the support panel. */
export function NotSureCard() {
  return (
    <div className="hero-gradient flex flex-col gap-5 rounded-[28px] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
      <div className="max-w-xl">
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Not sure what&apos;s right for you?</h3>
        <p className="mt-2 text-sm text-white/90">Don&apos;t guess with your health. Tap <b>Need help?</b> and a pharmacist will answer straight away or call us any time, day or night.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={openSupport} className="btn btn-white shadow-lg"><Headset size={16} /> Need help? Chat with us</button>
        <a href={`tel:+${SUPPORT.phone}`} className="btn bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25"><Phone size={16} /> {pretty(SUPPORT.phone)}</a>
      </div>
    </div>
  );
}
