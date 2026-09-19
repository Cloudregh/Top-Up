/* eslint-disable @next/next/no-img-element -- remote CDN URLs are already sized/optimised (Pexels/Cloudinary) */
import { img, type ImgKey } from "@/lib/images";

export function Img({ k, w = 800, h, alt = "", className = "", priority = false, style }:
  { k: ImgKey; w?: number; h?: number; alt?: string; className?: string; priority?: boolean; style?: React.CSSProperties }) {
  return <img src={img(k, w, h)} srcSet={`${img(k, w, h)} 1x, ${img(k, w * 2, h && h * 2)} 2x`} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={className} style={style} />;
}
