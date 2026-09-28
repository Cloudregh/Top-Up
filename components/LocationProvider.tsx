"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import type { Coords } from "@/lib/geo";

type LocState = "idle" | "locating" | "ready" | "denied" | "unavailable";
interface Ctx { coords: Coords | null; state: LocState; locate: () => void }
const LocCtx = createContext<Ctx | null>(null);
export const useLocation = () => { const c = useContext(LocCtx); if (!c) throw new Error("LocationProvider missing"); return c; };

/** Asks the browser for the customer's position once they're signed in; forgotten on sign-out. Never sent to the API. */
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [state, setState] = useState<LocState>("idle");

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) { setState("unavailable"); return; }
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (p) => { setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }); setState("ready"); },
      (e) => setState(e.code === e.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  }, []);

  useEffect(() => {
    if (status === "authed") locate();
    else if (status === "guest") { setCoords(null); setState("idle"); }
  }, [status, locate]);

  const value = useMemo(() => ({ coords, state, locate }), [coords, state, locate]);
  return <LocCtx.Provider value={value}>{children}</LocCtx.Provider>;
}
