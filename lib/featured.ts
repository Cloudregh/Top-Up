import type { CatalogueItem } from "./types";

/** The API has no featured / best-seller flags, so the home sections simply show catalogue items in the order the API returns them. */
export function pickSections(items: CatalogueItem[]) {
  return { featured: items.slice(0, 8), popular: items.length > 8 ? items.slice(8, 16) : items.slice(0, 8) };
}
