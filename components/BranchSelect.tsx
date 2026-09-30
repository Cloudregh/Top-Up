"use client";
import { useEffect } from "react";
import { BRANCHES_LIST } from "@/lib/branches";
import { distanceKm, inGhana, prettyKm } from "@/lib/geo";
import { useLocation } from "./LocationProvider";
import { Select } from "./Select";

/**
 * Pickup-branch dropdown, nearest first when we know where the customer (or who they're buying for) is.
 * Until the customer picks one themselves (`picked`), it follows the nearest branch via `onAuto`.
 */
export function BranchSelect({ id, value, onChange, picked, onAuto }:
  { id?: string; value: string; onChange: (name: string) => void; picked: boolean; onAuto: (name: string) => void }) {
  const { coords } = useLocation();
  const here = coords && inGhana(coords) ? coords : null;
  const opts = BRANCHES_LIST.filter((b) => !b.wholesale)
    .map((b) => ({ b, km: here ? distanceKm(here, b) : null }))
    .sort((x, y) => (x.km ?? 0) - (y.km ?? 0))
    .map(({ b, km }, i) => ({ value: b.name, label: b.name, sub: b.area, meta: km == null ? undefined : prettyKm(km), tag: i === 0 && km != null ? "Nearest" : undefined }));
  const nearest = here ? opts[0].value : null;
  useEffect(() => { if (!picked && nearest && nearest !== value) onAuto(nearest); }, [picked, nearest, value, onAuto]);
  return <Select id={id} value={value} onChange={onChange} options={opts} />;
}
