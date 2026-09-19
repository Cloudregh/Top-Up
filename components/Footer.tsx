import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SUPPORT, pretty } from "@/lib/format";
import { Logo } from "./Logo";

const cols: [string, [string, string][]][] = [
  ["Shop", [["/shop", "All products"], ["/prescriptions", "Prescriptions"], ["/cart", "Cart"], ["/orders", "My orders"]]],
  ["Explore", [["/about", "About Us"], ["/why-choose-us", "Why Choose Us"], ["/services", "Services"], ["/news", "News"], ["/careers", "Careers"], ["/contact", "Contact"]]],
  ["Health Hub", [["/appointment", "Book Appointment"], ["/corporate-health", "Corporate Health"], ["/travel-health", "Travel Health"], ["/faq", "FAQ's"]]],
];

export function Footer() {
  return (
    <footer className="mt-10 overflow-hidden bg-mist pb-24 sm:pb-0">
      <div className="gutter pt-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)_1.3fr]">
          <div className="space-y-4">
            <Logo size={48} tagline />
            <p className="max-w-65 text-sm text-muted">One of the best pharmacies in Ghana — a leading retail and wholesale pharmaceutical company with branches in Tema, Accra and Kumasi.</p>
          </div>
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
        <p className="wordmark mt-10 select-none text-center text-[clamp(4.5rem,21vw,20rem)] font-extrabold leading-[0.85] tracking-tighter" aria-hidden>Top-Up</p>
      </div>
      <div className="gutter flex flex-wrap justify-between gap-2 border-t border-[#d5e6f8] bg-white py-5 text-xs text-muted">
        <span>© {new Date().getFullYear()} Top-Up Pharmacy. All Rights Reserved.</span>
        <span>Whatever you need….24/7</span>
      </div>
    </footer>
  );
}
