export interface Coords { lat: number; lng: number }
export interface Place extends Coords { name: string }

/** Great-circle (haversine) distance in km. */
export function distanceKm(a: Coords, b: Coords) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** [value, unit] so the number and unit can be styled separately. */
export const kmParts = (km: number): [string, string] =>
  km < 1 ? [String(Math.round(km * 1000)), "m"] : [km.toFixed(km < 10 ? 1 : 0), "km"];
export const prettyKm = (km: number) => kmParts(km).join(" ");

/** Ghana's bounding box — coarse (clips slivers of neighbours at the borders), fine for "in Ghana or abroad". */
export const inGhana = ({ lat, lng }: Coords) => lat >= 4.5 && lat <= 11.2 && lng >= -3.3 && lng <= 1.25;

/** Towns a customer can deliver to when buying for someone else. Town-centre coordinates, approximate. */
export const GHANA_PLACES: Place[] = [
  { name: "Accra Central", lat: 5.55, lng: -0.207 },
  { name: "Osu", lat: 5.556, lng: -0.18 },
  { name: "Labone", lat: 5.565, lng: -0.17 },
  { name: "Cantonments", lat: 5.578, lng: -0.172 },
  { name: "Airport Residential", lat: 5.6, lng: -0.18 },
  { name: "East Legon", lat: 5.635, lng: -0.16 },
  { name: "Madina", lat: 5.68, lng: -0.165 },
  { name: "Adenta", lat: 5.708, lng: -0.167 },
  { name: "Achimota", lat: 5.62, lng: -0.225 },
  { name: "Lapaz", lat: 5.606, lng: -0.25 },
  { name: "Dansoman", lat: 5.55, lng: -0.265 },
  { name: "Spintex", lat: 5.633, lng: -0.105 },
  { name: "Teshie", lat: 5.583, lng: -0.107 },
  { name: "Nungua", lat: 5.6, lng: -0.077 },
  { name: "Tema", lat: 5.67, lng: -0.017 },
  { name: "Ashaiman", lat: 5.695, lng: -0.033 },
  { name: "Dodowa", lat: 5.883, lng: -0.098 },
  { name: "Kasoa", lat: 5.534, lng: -0.42 },
  { name: "Winneba", lat: 5.351, lng: -0.623 },
  { name: "Cape Coast", lat: 5.105, lng: -1.246 },
  { name: "Takoradi", lat: 4.898, lng: -1.76 },
  { name: "Koforidua", lat: 6.094, lng: -0.259 },
  { name: "Ho", lat: 6.6, lng: 0.47 },
  { name: "Aflao", lat: 6.12, lng: 1.19 },
  { name: "Kumasi", lat: 6.688, lng: -1.624 },
  { name: "Obuasi", lat: 6.2, lng: -1.666 },
  { name: "Sunyani", lat: 7.339, lng: -2.327 },
  { name: "Techiman", lat: 7.583, lng: -1.939 },
  { name: "Tamale", lat: 9.403, lng: -0.839 },
  { name: "Bolgatanga", lat: 10.785, lng: -0.851 },
  { name: "Wa", lat: 10.06, lng: -2.5 },
];
