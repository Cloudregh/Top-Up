"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, errInfo } from "./api";
import type { CatalogueItem, Page } from "./types";
import { useAuth } from "@/components/AuthProvider";

/** Redirects guests to /login?next=… and reports when it's safe to fetch. */
export function useRequireAuth() {
  const { status } = useAuth();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (status === "guest") router.replace(`/login?next=${encodeURIComponent(path)}`); }, [status, router, path]);
  return status === "authed";
}

/** Small fetch helper with loading/error/retry. */
export function useFetch<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ReturnType<typeof errInfo> | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!path) return;
    let live = true;
    setLoading(true); setError(null);
    api<T>(path).then((d) => live && setData(d)).catch((e) => live && setError(errInfo(e))).finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [path, n]);
  return { data, error, loading, retry: () => setN((x) => x + 1), setData };
}

/**
 * Cursor-paginated catalogue straight from GET /catalogue.
 * The endpoint needs a token, so signed-out visitors are `gated` (UI shows placeholders, never invented products).
 */
export function useCatalogue(q: string, category: string, limit = 12) {
  const { status } = useAuth();
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReturnType<typeof errInfo> | null>(null);
  const [n, setN] = useState(0);
  const seq = useRef(0);
  const gated = status === "guest";

  const fetchPage = useCallback(async (cur: string | null, append: boolean) => {
    const id = ++seq.current;
    setLoading(true); setError(null);
    try {
      const qs = new URLSearchParams({ limit: String(limit) });
      if (q) qs.set("q", q); if (category) qs.set("category", category); if (cur) qs.set("cursor", cur);
      const page = await api<Page<CatalogueItem>>(`/catalogue?${qs}`);
      if (id !== seq.current) return;
      setItems((x) => (append ? [...x, ...page.data] : page.data));
      setCursor(page.next_cursor);
    } catch (e) { if (id === seq.current) setError(errInfo(e)); }
    finally { if (id === seq.current) setLoading(false); }
  }, [q, category, limit]);

  useEffect(() => { if (status === "authed") fetchPage(null, false); }, [status, fetchPage, n]);
  return { items, loading: loading || status === "loading", error, gated, hasMore: !!cursor, more: () => fetchPage(cursor, true), retry: () => setN((x) => x + 1) };
}
