// Central image registry. Today every key resolves to a Pexels placeholder;
// once the assets are uploaded to Cloudinary under `topup/<key>`, set
// NEXT_PUBLIC_IMAGE_SOURCE=cloudinary (+ cloud name) and nothing else changes.
const PEXELS: Record<string, number> = {
  hero: 18828741,            // pharmacist portrait (studio backdrop)
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
  prod_tablet: 13779107,
  prod_capsule: 13787561,
  prod_vitamin: 14027297,
  prod_cream: 8131589,
  prod_injection: 20140041,
  about_counter: 12332074,
  about_pharmacist: 19471015,
  appointment: 8376309,
  shelves: 6074000,
  corporate: 19218034,
  travel: 5863437,
};

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const useCloudinary = process.env.NEXT_PUBLIC_IMAGE_SOURCE === "cloudinary" && !!CLOUD;

export type ImgKey = keyof typeof PEXELS;
export const IMAGE_KEYS = Object.keys(PEXELS);

export function img(key: ImgKey, w = 800, h?: number): string {
  if (useCloudinary) return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${w}${h ? `,h_${h},c_fill,g_auto` : ""}/topup/${key}`;
  const id = PEXELS[key];
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}${h ? `&h=${h}&fit=crop` : ""}`;
}

/** Best-available placeholder photo for a catalogue item until the API serves product images. */
export function productImageKey(name: string): ImgKey | null {
  const n = name.toLowerCase();
  if (/syrup|drops|inhaler|spray|ml\b/.test(n)) return null; // no photo yet -> illustrated fallback
  if (/cream|gel|ointment|lotion/.test(n)) return "prod_cream";
  if (/inject|vial|vaccine/.test(n)) return "prod_injection";
  if (/vitamin|zinc|supplement|complete|omega|cod liver/.test(n)) return "prod_vitamin";
  if (/capsule|softgel|omeprazole|amoxicillin|tramadol/.test(n)) return "prod_capsule";
  return "prod_tablet";
}
