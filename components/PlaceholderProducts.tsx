import Link from "next/link";
import { Lock } from "lucide-react";

/**
 * GET /catalogue requires a token, so signed-out visitors get honest placeholder
 * tiles (no invented products, prices or stock) until a public catalogue exists.
 */
export function PlaceholderProducts({ n = 4, cols = "grid-cols-2 lg:grid-cols-4" }: { n?: number; cols?: string }) {
  return (
    <div>
      <div className={`grid gap-4 ${cols}`}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="tile flex flex-col p-4" aria-hidden>
            <div className="skeleton h-3.5 w-3/4" /><div className="skeleton mt-2 h-3 w-1/3" />
            <div className="skeleton mt-3 aspect-square !rounded-[20px]" />
            <div className="mt-4 flex items-center justify-between"><div className="skeleton h-5 w-16" /><div className="skeleton h-9 w-20 !rounded-full" /></div>
          </div>
        ))}
      </div>
      <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-muted"><Lock size={14} /> Products, live stock and your own price are shown after you sign in.
        <Link href="/login" className="font-semibold text-brand underline">Sign in</Link></p>
    </div>
  );
}
