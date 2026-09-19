import { mockApi } from "./mock";

const BASE = "/api/v1";
export const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

let accessToken: string | null = null;
export const setToken = (t: string | null) => { accessToken = t; };
export const hasToken = () => !!accessToken;

/** RFC 9457 problem — show `title`/`detail`, branch on `code`. */
export class ApiError extends Error {
  constructor(public status: number, public title: string, public detail?: string, public code?: string) {
    super(detail || title);
  }
}

async function toError(res: Response) {
  let p: { title?: string; detail?: string; code?: string } = {};
  try { p = await res.json(); } catch { /* non-JSON body */ }
  return new ApiError(res.status, p.title || res.statusText || "Request failed", p.detail, p.code);
}

let refreshing: Promise<boolean> | null = null;
export function refreshSession(): Promise<boolean> {
  if (DEMO) return Promise.resolve(mockApi.hasSession());
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${BASE}/customer/auth/refresh`, { method: "POST", credentials: "include" });
      if (!res.ok) return false;
      setToken((await res.json()).access_token);
      return true;
    } catch { return false; } finally { setTimeout(() => (refreshing = null), 0); }
  })();
  return refreshing;
}

interface Opts { method?: string; body?: unknown; idempotencyKey?: string; auth?: boolean; signal?: AbortSignal }

export async function api<T = unknown>(path: string, o: Opts = {}): Promise<T> {
  const method = o.method ?? "GET";
  if (DEMO) return mockApi.handle<T>(path, method, o.body);

  const go = () => fetch(BASE + path, {
    method, credentials: "include", signal: o.signal,
    headers: {
      ...(o.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(accessToken && o.auth !== false ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(o.idempotencyKey ? { "Idempotency-Key": o.idempotencyKey } : {}),
    },
    body: o.body !== undefined ? JSON.stringify(o.body) : undefined,
  });

  let res = await go();
  if (res.status === 401 && o.auth !== false && (await refreshSession())) res = await go();
  if (!res.ok) throw await toError(res);
  return res.status === 204 ? (undefined as T) : res.json();
}

export const newKey = () => crypto.randomUUID();

/** Normalises real ApiErrors and demo-mode errors into { title, detail, code, status }. */
export function errInfo(e: unknown) {
  const x = e as Partial<ApiError> | undefined;
  return {
    status: x?.status ?? 0,
    title: x?.title || (e instanceof Error ? e.message : "Something went wrong"),
    detail: x?.detail as string | undefined,
    code: x?.code as string | undefined,
  };
}
