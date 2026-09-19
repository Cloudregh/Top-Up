"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { Menu, Pill, Search, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/prescriptions", label: "Prescriptions" },
  { href: "/orders", label: "Orders" },
];

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

  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <div className="container-x !max-w-[1200px] !px-0">
        <div className="card flex items-center gap-3 !rounded-[28px] px-4 py-3 backdrop-blur sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold" aria-label="Top-Up Pharmacy home">
            <span className="grid size-9 place-items-center rounded-full bg-brand text-white"><Pill size={18} /></span>
            <span className="hidden sm:inline">Top-Up <span className="text-leaf">Pharmacy</span></span>
          </Link>
          <nav className="mx-auto hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active(n.href) ? "bg-ink text-white" : "hover:bg-mist"}`}>{n.label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <button className="btn btn-soft !p-3" aria-label="Search products" onClick={() => router.push("/shop?focus=1")}><Search size={18} /></button>
            <Link href="/cart" className="btn btn-soft relative !p-3" aria-label={`Cart, ${count} items`}>
              <ShoppingBag size={18} />
              {count > 0 && <span ref={badge} className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">{count}</span>}
            </Link>
            {status === "authed" ? (
              <Link href="/account" className="btn btn-primary hidden !py-2.5 sm:inline-flex"><User size={16} />{user?.name.split(" ")[0]}</Link>
            ) : status === "guest" ? (
              <Link href="/login" className="btn btn-primary hidden !py-2.5 sm:inline-flex">Sign in</Link>
            ) : <span className="skeleton hidden h-10 w-24 sm:block" />}
            <button className="btn btn-soft !p-3 md:hidden" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </div>
        {open && (
          <div className="card mt-2 flex flex-col gap-1 p-3 md:hidden">
            {[...NAV, status === "authed" ? { href: "/account", label: "My account" } : { href: "/login", label: "Sign in" }].map((n) => (
              <Link key={n.href} href={n.href} className={`rounded-2xl px-4 py-3 font-medium ${active(n.href) ? "bg-ink text-white" : "hover:bg-mist"}`}>{n.label}</Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
