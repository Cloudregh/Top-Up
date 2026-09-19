"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { ArrowUpRight, ChevronDown, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { NAV } from "@/lib/site";

type MobileItem = { label: string; href: string | null };
const mobileItems: MobileItem[] = NAV.flatMap((n): MobileItem[] =>
  "children" in n ? [{ label: n.label, href: null }, ...n.children.map((c) => ({ label: c.label, href: c.href }))] : [{ label: n.label, href: n.href }]);

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const { status, user } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const badge = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (badge.current) animate(badge.current, { scale: [1, 1.5, 1], duration: 450, ease: "outBack" });
  }, [count]);

  const isActive = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <header className="sticky top-0 z-50 border-b border-[#e3eefb] bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-8 lg:px-12">
      <div className="flex items-center gap-4">
        <Logo size={44} />

        <nav className="mx-auto hidden items-center gap-6 xl:flex" aria-label="Main">
          {NAV.map((n) => "children" in n ? (
            <div key={n.label} className="group relative">
              <button className="dot flex items-center gap-1 text-sm font-medium text-ink/80 hover:text-ink">{n.label}<ChevronDown size={13} /></button>
              <div className="invisible absolute left-0 top-full z-10 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="tile min-w-52 bg-white p-2 shadow-xl ring-1 ring-black/5">
                  {n.children.map((c) => <Link key={c.href} href={c.href} className="block rounded-2xl px-4 py-2.5 text-sm font-medium hover:bg-mist">{c.label}</Link>)}
                </div>
              </div>
            </div>
          ) : (
            <Link key={n.href} href={n.href} className={`dot text-sm font-medium transition ${isActive(n.href) ? "text-brand" : "text-ink/80 hover:text-ink"}`}>{n.label}</Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <Link href="/appointment" className="btn btn-soft hidden whitespace-nowrap py-3! md:inline-flex">Appointment <ArrowUpRight size={15} /></Link>
          <button className="btn btn-soft p-3!" aria-label="Search products" onClick={() => router.push("/shop?focus=1")}><Search size={18} /></button>
          <Link href="/cart" className="btn btn-soft relative p-3!" aria-label={`Cart, ${count} items`}>
            <ShoppingBag size={18} />
            {count > 0 && <span ref={badge} className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-sky px-1 text-[11px] font-bold text-white">{count}</span>}
          </Link>
          {status === "authed" ? (
            <Link href="/account" className="btn btn-primary hidden whitespace-nowrap py-3! lg:inline-flex"><User size={16} />{user?.name.split(" ")[0]}</Link>
          ) : status === "guest" ? (
            <Link href="/login" className="btn btn-primary hidden whitespace-nowrap py-3! lg:inline-flex">Sign in</Link>
          ) : <span className="skeleton hidden h-11 w-24 lg:block" />}
          <button className="btn btn-soft p-3! xl:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>

      {open && (
        <div data-lenis-prevent className="tile mt-3 max-h-[calc(100dvh-6rem)] space-y-1 overflow-y-auto overscroll-contain bg-white p-3 shadow-xl ring-1 ring-black/5 xl:hidden">
          {mobileItems.map((n) => n.href === null
            ? <p key={n.label} className="px-4 pt-3 text-xs font-bold uppercase tracking-wide text-muted">{n.label}</p>
            : <Link key={n.href} href={n.href} className="block rounded-2xl px-4 py-3 font-medium hover:bg-mist">{n.label}</Link>)}
          <div className="grid grid-cols-2 gap-2 pt-3">
            <Link href="/orders" className="btn btn-soft">My orders</Link>
            {status === "authed" ? <Link href="/account" className="btn btn-primary">Account</Link> : <Link href="/login" className="btn btn-primary">Sign in</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
