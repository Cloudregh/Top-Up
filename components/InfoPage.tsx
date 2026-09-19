import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Img } from "./Img";
import { Reveal } from "./Reveal";
import type { ImgKey } from "@/lib/images";

export function InfoHero({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro: string; image?: ImgKey }) {
  return (
    <section className="gutter">
      <div className="hero-gradient relative flex min-h-[320px] items-end overflow-hidden rounded-[30px] p-8 sm:min-h-[380px] sm:p-12">
        {image && <Img k={image} w={1000} h={700} alt="" priority className="absolute inset-y-0 right-0 hidden h-full w-[42%] object-cover sm:block" style={{ maskImage: "linear-gradient(to right, transparent, #000 40%)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 40%)" }} />}
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-semibold text-white/90">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">{title}</h1>
          <p className="mt-4 text-sm text-white/90 sm:text-base">{intro}</p>
        </div>
      </div>
    </section>
  );
}

export function Section({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return <Reveal className={`mt-16 gutter ${className}`}>{title && <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>}{children}</Reveal>;
}

export function Cta({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return <Link href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})} className="btn btn-primary">{children} <ArrowUpRight size={15} /></Link>;
}
