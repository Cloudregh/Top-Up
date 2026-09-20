import { ImageOff } from "lucide-react";

/** The catalogue API has no image field yet, so every product shows this placeholder. */
export function ProductImage({ name, className = "" }: { name: string; className?: string }) {
  return (
    <div className={`grid size-full place-items-center bg-linear-to-br from-mist to-white ${className}`} role="img" aria-label={`${name} — image coming soon`}>
      <span className="flex flex-col items-center gap-1.5 text-sky/70"><ImageOff size={28} strokeWidth={1.5} /><span className="text-[10px] font-semibold uppercase tracking-wider">Image soon</span></span>
    </div>
  );
}
