import type { CatalogueItem } from "./types";

/**
 * The API has no featured / best-seller / promotion flags yet. Until it does we
 * show the first catalogue items; once `featured` / `best_seller` arrive on
 * CatalogueItem they are used automatically.
 */
export function pickSections(items: CatalogueItem[]) {
  const featured = items.filter((i) => i.featured);
  const best = items.filter((i) => i.best_seller);
  return {
    featured: featured.length ? featured : items.slice(0, 8),
    popular: best.length ? best : items.length > 8 ? items.slice(8, 16) : items.slice(0, 8),
    flagged: featured.length > 0 || best.length > 0,
  };
}
