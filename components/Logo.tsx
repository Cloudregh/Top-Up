/* eslint-disable @next/next/no-img-element -- static brand asset from /public */
import Link from "next/link";

export function Logo({ size = 40, tagline = false, className = "" }: { size?: number; tagline?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Top-Up Pharmacy home" className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo-mark.png" alt="" width={size} height={size} style={{ width: size, height: size }} className="shrink-0 object-contain" />
      <span className="leading-none">
        <span className="block text-[1.35rem] font-extrabold tracking-tight text-navy">TOP-UP</span>
        <span className="mt-1 block text-[0.62rem] font-bold tracking-[0.42em] text-navy">PHARMACY</span>
        {tagline && <span className="mt-1 block text-[0.7rem] font-semibold italic text-navy">Whatever you need….24/7</span>}
      </span>
    </Link>
  );
}
