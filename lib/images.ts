// Central image registry. Today every key resolves to a Pexels placeholder (people photos are
// Black/African subjects); swap in Top-Up's own photos via LOCAL below or Cloudinary;
// once the assets are uploaded to Cloudinary under `topup/<key>`, set
// NEXT_PUBLIC_IMAGE_SOURCE=cloudinary (+ cloud name) and nothing else changes.
const PEXELS: Record<string, number> = {
  // Campaign cards + pages (Black/African subjects)
  campaign_cough: 3961224,        // woman with a cold under a blanket
  campaign_pain: 7298673,         // woman with a headache
  campaign_early: 6303702,        // woman holding the pink awareness ribbon
  // Home promo cards
  consult_appointment: 19596247,  // Black woman pharmacist/doctor
  consult_prescription: 19963130, // Black woman in scrubs with stethoscope
  delivery: 6995138,              // courier handing over a parcel
  // Inner-page heroes
  about_pharmacist: 5430213,      // African nurse in scrubs
  appointment: 33674901,          // African nurse portrait
  support: 8204385,               // customer-support agent with headset
  corporate: 19218034,            // Black woman doctor
  travel: 5863437,                // vaccine vials (no people)
};

// Assets we ship ourselves. With Cloudinary on, these resolve to topup/<key> instead
// (upload a background-removed PNG; Cloudinary can also do e_background_removal).
// To use your own photo for any key, drop the file in /public/images and map it here, e.g.
//   about_counter: "/images/branch-tema.jpg"
const LOCAL: Record<string, string> = { hero_cutout: "/hero-pharmacist.webp", pharmacy: "/images/pharmacy.jpg" };

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
