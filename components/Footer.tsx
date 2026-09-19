import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SUPPORT, pretty } from "@/lib/format";

const cols: [string, [string, string][]][] = [
  ["Shop", [["/shop", "All products"], ["/prescriptions", "Prescriptions"], ["/cart", "Cart"], ["/orders", "My orders"]]],
  ["Explore", [["/about", "About Us"], ["/why-choose-us", "Why Choose Us"], ["/services", "Services"], ["/news", "News"], ["/careers", "Careers"], ["/contact", "Contact"]]],
  ["Health Hub", [["/appointment", "Book Appointment"], ["/corporate-health", "Corporate Health"], ["/travel-health", "Travel Health"], ["/faq", "FAQ's"]]],
];

export function Footer() {
  return (
    <footer className="mx-auto mt-3 max-w-[1360px] px-0 pb-24 sm:px-0 sm:pb-6">
      <div className="sheet !mt-0 overflow-hidden px-6 pt-12 sm:px-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)_1.3fr]">
          <p className="max-w-[220px] text-sm text-muted">Top-Up Pharmacy is one of the best pharmacies in Ghana — a leading retail and wholesale pharmaceutical company with branches in Tema, Accra and Kumasi.</p>
          {cols.map(([t, ls]) => (
            <div key={t}><p className="mb-4 text-sm font-bold">{t}</p><ul className="space-y-2.5 text-sm text-muted">{ls.map(([h, l]) => <li key={h}><Link href={h} className="hover:text-ink">{l}</Link></li>)}</ul></div>
          ))}
          <div>
            <p className="mb-4 text-sm font-bold">Contact</p>
            <ul className="space-y-2.5 text-sm text-muted">
              <li className="flex gap-2"><Clock size={15} className="mt-0.5 shrink-0" /> Open 24/7</li>
              <li className="flex gap-2"><Phone size={15} className="mt-0.5 shrink-0" /><span>{pretty(SUPPORT.phone)}<br />{pretty(SUPPORT.phone2)}</span></li>
              <li className="flex gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> Sena House, Hospital Road, Community 9, Tema</li>
              {SUPPORT.email && <li className="flex gap-2"><Mail size={15} className="mt-0.5 shrink-0" />{SUPPORT.email}</li>}
            </ul>
          </div>
        </div>
        <p className="wordmark mt-10 select-none text-center text-[clamp(4.5rem,21vw,17rem)] font-extrabold leading-[0.85] tracking-tighter" aria-hidden>Top-Up</p>
        <div className="-mx-6 flex flex-wrap justify-between gap-2 border-t border-mist px-6 py-5 text-xs text-muted sm:-mx-12 sm:px-12">
          <span>© {new Date().getFullYear()} Top-Up Pharmacy. All Rights Reserved.</span>
          <span>Whatever you need… 24/7</span>
        </div>
      </div>
    </footer>
  );
}
