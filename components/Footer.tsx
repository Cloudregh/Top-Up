import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SUPPORT, pretty } from "@/lib/format";

export function Footer() {
  return (
    <footer className="mt-24 px-3 pb-24 sm:pb-6">
      <div className="card container-x !max-w-[1200px] px-6 py-10 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="text-2xl font-bold">Top-Up <span className="text-leaf">Pharmacy</span></p>
            <p className="mt-3 max-w-xs text-sm text-muted">Retail and wholesale pharmaceutical care with branches in Tema and Accra. Whatever you need… 24/7.</p>
          </div>
          <FooterCol title="Shop" links={[["/shop", "All products"], ["/prescriptions", "Prescriptions"], ["/cart", "Cart"], ["/orders", "My orders"]]} />
          <FooterCol title="Account" links={[["/login", "Sign in"], ["/register", "Business account"], ["/account", "Statements & credit"]]} />
          <div>
            <p className="mb-3 font-semibold">Contact</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0" /> Open 24/7</li>
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /><span>{pretty(SUPPORT.phone)}<br />{pretty(SUPPORT.phone2)}</span></li>
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> Sena House, Hospital Road, Community 9, Tema</li>
              {SUPPORT.email && <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" />{SUPPORT.email}</li>}
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-mist pt-5 text-xs text-muted">© {new Date().getFullYear()} Top-Up Pharmacy. All rights reserved.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 font-semibold">{title}</p>
      <ul className="space-y-2 text-sm text-muted">{links.map(([h, l]) => <li key={h}><Link href={h} className="hover:text-ink">{l}</Link></li>)}</ul>
    </div>
  );
}
