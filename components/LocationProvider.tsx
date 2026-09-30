"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { buyingFor } from "@/lib/local";
import type { Coords, Place } from "@/lib/geo";

type LocState = "idle" | "locating" | "ready" | "denied" | "unavailable";
interface Ctx {
  /** Where branches are measured from: the "buying for" town if one is set, else the device's position. */
  coords: Coords | null;
  state: LocState;
  locate: () => void;
  /** Set when buying for someone else; null means "use my location". */
  place: Place | null;
  setPlace: (p: Place | null) => void;
}
const LocCtx = createContext<Ctx | null>(null);
export const useLocation = () => { const c = useContext(LocCtx); if (!c) throw new Error("LocationProvider missing"); return c; };

/** Asks the browser for the customer's position once they're signed in; forgotten on sign-out. Never sent to the API. */
export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const [gps, setGps] = useState<Coords | null>(null);
  const [state, setState] = useState<LocState>("idle");
  const [place, setPlaceState] = useState<Place | null>(null);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) { setState("unavailable"); return; }
    setState("locating");
    navigator.geolocation.getCurrentPosition(
      (p) => { setGps({ lat: p.coords.latitude, lng: p.coords.longitude }); setState("ready"); },
      (e) => setState(e.code === e.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  }, []);
  const setPlace = useCallback((p: Place | null) => { setPlaceState(p); buyingFor.set(p); }, []);

  useEffect(() => {
    if (status === "authed") { setPlaceState(buyingFor.get()); locate(); }
    else if (status === "guest") {
      setGps(null); setState("idle"); setPlaceState(null); buyingFor.set(null);
    }
  }, [status, locate]);

  const value = useMemo(() => ({ coords: place ?? gps, state: place ? "ready" as const : state, locate, place, setPlace }),
    [gps, state, locate, place, setPlace]);
  return <LocCtx.Provider value={value}>{children}</LocCtx.Provider>;
}
