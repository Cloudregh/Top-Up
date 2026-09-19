/* eslint-disable @next/next/no-img-element -- product images come from the API/Cloudinary as absolute URLs */
import { ImageOff } from "lucide-react";

/** Shows the API's `image_url`; until the API provides one, a neutral placeholder. */
export function ProductImage({ name, image_url, className = "" }: { name: string; image_url?: string | null; className?: string }) {
  if (image_url) return <img src={image_url} alt={name} loading="lazy" decoding="async" className={`size-full object-cover ${className}`} />;
  return (
    <div className={`grid size-full place-items-center bg-linear-to-br from-mist to-white ${className}`} role="img" aria-label={`${name} — image coming soon`}>
      <span className="flex flex-col items-center gap-1.5 text-sky/70"><ImageOff size={28} strokeWidth={1.5} /><span className="text-[10px] font-semibold uppercase tracking-wider">Image soon</span></span>
    </div>
  );
}
