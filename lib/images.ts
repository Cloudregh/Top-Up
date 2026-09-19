// Central image registry. Today every key resolves to a Pexels placeholder;
// once the assets are uploaded to Cloudinary under `topup/<key>`, set
// NEXT_PUBLIC_IMAGE_SOURCE=cloudinary (+ cloud name) and nothing else changes.
const PEXELS: Record<string, number> = {
  cat_vitamins: 13787561,
  cat_cough: 6285297,
  cat_pain: 19141233,
  cat_stomach: 7298668,
  cat_pregnancy: 2100341,
  cat_baby: 32103051,
  season_pain: 7034805,
  season_early: 15641079,
  season_family: 5479909,
  consult_appointment: 19596247,
  consult_prescription: 19963130,
  delivery: 5025638,
  delivery_2: 4440987,
  about_counter: 12332074,
  about_pharmacist: 19471015,
  appointment: 8376309,
  shelves: 6074000,
  corporate: 19218034,
  travel: 5863437,
};

// Assets we ship ourselves. With Cloudinary on, these resolve to topup/<key> instead
// (upload a background-removed PNG; Cloudinary can also do e_background_removal).
const LOCAL: Record<string, string> = { hero_cutout: "/hero-pharmacist.webp" };

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const useCloudinary = process.env.NEXT_PUBLIC_IMAGE_SOURCE === "cloudinary" && !!CLOUD;

export type ImgKey = keyof typeof PEXELS | "hero_cutout";
export const IMAGE_KEYS = [...Object.keys(PEXELS), ...Object.keys(LOCAL)];

export function img(key: ImgKey, w = 800, h?: number): string {
  if (useCloudinary) return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${w}${h ? `,h_${h},c_fill,g_auto` : ""}/topup/${key}`;
  if (LOCAL[key]) return LOCAL[key];
  const id = PEXELS[key as keyof typeof PEXELS];
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? `&h=${h}&fit=crop` : ""}`;
}
