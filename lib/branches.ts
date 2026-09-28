import { api } from "./api";
import { distanceKm, type Coords } from "./geo";
import type { Availability } from "./types";

// Branch list supplied by Top-Up (Google Business listings). PLACEHOLDER until a
// customer-readable GET /locations exists; then replace this file's data with the API.
export type Region = "Accra" | "Tema" | "Kumasi" | "Other regions";
// phone/hours optional: the card falls back to the main hotline / hides hours until supplied.
// lat/lng are APPROXIMATE (area-level) until GET /locations supplies real coordinates.
export interface Branch { name: string; area: string; region: Region; lat: number; lng: number; phone?: string; hours?: string; delivery?: boolean; wholesale?: boolean }

export const BRANCHES_LIST: Branch[] = [
  { name: "Tema Community 9", area: "Hospital Road, Community 9, Tema", region: "Tema", lat: 5.657, lng: -0.015, phone: "0204355201", hours: "Open 24 hours" },
  { name: "Tema Community 4", area: "Lakai St, Community 4, Tema", region: "Tema", lat: 5.644, lng: -0.007, phone: "0204355202", hours: "Open 24 hours" },
  { name: "Tema Community 2", area: "Salifu Dagati Ext, Community 2, Tema", region: "Tema", lat: 5.638, lng: -0.011, phone: "0508288378", hours: "Open 24 hours" },
  { name: "Tema Community 25", area: "Adjacent Furniture City, near Palace Shopping Centre", region: "Tema", lat: 5.705, lng: -0.035, phone: "0201716504", hours: "Open 24 hours" },
  { name: "Coastal", area: "Hallelujah, New Sebrepor", region: "Tema", lat: 5.692, lng: -0.058, phone: "0509941535", hours: "Open 24 hours" },
  { name: "Wholesale Community 11", area: "Community 11, Tema", region: "Tema", lat: 5.66, lng: -0.002, phone: "0501682627", hours: "Mon–Fri, opens 7 am", wholesale: true },
  { name: "Osu Oxford Street", area: "Adjacent KFC, Oxford St, Accra", region: "Accra", lat: 5.556, lng: -0.182, phone: "0242226555", hours: "Open 24 hours" },
  { name: "Osu La Road", area: "Opposite Osu Police Station, La Rd", region: "Accra", lat: 5.5545, lng: -0.1765, phone: "0508910270", hours: "Open 24 hours" },
  { name: "East Legon", area: "Jesuskro Square, Garden Rd", region: "Accra", lat: 5.635, lng: -0.16, phone: "0501447384", hours: "Open 24 hours" },
  { name: "Spintex", area: "Spintex, Accra", region: "Accra", lat: 5.633, lng: -0.105, phone: "0302800941", hours: "Open 24 hours" },
  { name: "Achimota", area: "Achimota – Ofankor Bypass, Mile 7", region: "Accra", lat: 5.665, lng: -0.238, phone: "0242371954", hours: "Closes 10 pm" },
  { name: "Airport Hills", area: "Mayfair Rd, Accra", region: "Accra", lat: 5.611, lng: -0.164, phone: "0506475825", hours: "Closes 9 pm", delivery: true },
  { name: "Airport Residential", area: "Patrice Lumumba St, Accra", region: "Accra", lat: 5.599, lng: -0.184, phone: "0508288478", hours: "Closes 9:30 pm", delivery: true },
  { name: "Adabraka", area: "47 Castle Rd, Accra", region: "Accra", lat: 5.562, lng: -0.208, phone: "0501682628", hours: "Closes 9 pm", delivery: true },
  { name: "Kasoa", area: "Kasoa New Market Rd", region: "Other regions", lat: 5.534, lng: -0.42, phone: "0501583364", hours: "Closes 10 pm", delivery: true },
  { name: "Ho", area: "Ho, Volta Region", region: "Other regions", lat: 6.6, lng: 0.47, phone: "0202411437", hours: "Open 24 hours", delivery: true },
  { name: "Takoradi", area: "Adiembra Rd, Sekondi-Takoradi", region: "Other regions", lat: 4.917, lng: -1.758, phone: "0531012798", hours: "Closes 10 pm" },
  { name: "Adum, Kumasi", area: "Osei Tutu I Ave, Adum, Kumasi", region: "Kumasi", lat: 6.69, lng: -1.626, phone: "0509253029", hours: "Open 24 hours", delivery: true },
  { name: "Abuakwa, Kumasi", area: "Asenemaso, Abuakwa, Kumasi", region: "Kumasi", lat: 6.705, lng: -1.721 },
];

export const REGIONS: Region[] = ["Accra", "Tema", "Kumasi", "Other regions"];
export const telHref = (p: string) => `tel:+233${p.replace(/^0/, "")}`;
export const prettyPhone = (p: string) => `${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6)}`;
export const mapsHref = (b: Branch) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Top-Up Pharmacy ${b.name} ${b.area}`)}`;

/** Retail branches (wholesale excluded) sorted nearest-first, each with its distance in km. */
export const nearestBranches = (from: Coords, n = 3) =>
  BRANCHES_LIST.filter((b) => !b.wholesale)
    .map((b) => ({ ...b, km: distanceKm(from, b) }))
    .sort((x, y) => x.km - y.km)
    .slice(0, n);

/**
 * Per-branch stock for one product, keyed by branch name. PROPOSED endpoint (not in the OpenAPI file yet):
 * GET /catalogue/{id}/locations → { data: [{ location_name, availability }] }. Resolves null until it exists.
 */
export async function branchStock(productId: string): Promise<Record<string, Availability> | null> {
  try {
    const r = await api<{ data: { location_name: string; availability: Availability }[] }>(`/catalogue/${productId}/locations`);
    return Object.fromEntries(r.data.map((x) => [x.location_name, x.availability]));
  } catch { return null; }
}
