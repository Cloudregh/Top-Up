"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, refreshSession, setToken } from "@/lib/api";
import type { Customer, CustomerUser } from "@/lib/types";

type Status = "loading" | "authed" | "guest";
interface Ctx {
  status: Status; user: CustomerUser | null; customer: Customer | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadCustomer: () => Promise<void>;
}
const AuthCtx = createContext<Ctx | null>(null);
export const useAuth = () => { const c = useContext(AuthCtx); if (!c) throw new Error("AuthProvider missing"); return c; };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  const hydrate = useCallback(async () => {
    const me = await api<CustomerUser>("/customer/me");
    setUser(me);
    setStatus("authed");
    // Tier, credit limit and licence — non-fatal if the customer read is refused.
    api<Customer>(`/customers/${me.customer_id}`).then(setCustomer).catch(() => setCustomer(null));
  }, []);

  useEffect(() => {
    (async () => {
      try { if (await refreshSession()) return await hydrate(); } catch { /* fall through */ }
      setStatus("guest");
    })();
  }, [hydrate]);

  const login = useCallback(async (email: string, password: string) => {
    const t = await api<{ access_token: string }>("/customer/auth/login", { method: "POST", body: { email, password }, auth: false });
    setToken(t.access_token);
    await hydrate();
  }, [hydrate]);

  const logout = useCallback(async () => {
    try { await api("/customer/auth/logout", { method: "POST" }); } catch { /* already gone */ }
    setToken(null); setUser(null); setCustomer(null); setStatus("guest");
  }, []);

  const reloadCustomer = useCallback(async () => {
    if (user) setCustomer(await api<Customer>(`/customers/${user.customer_id}`));
  }, [user]);

  const value = useMemo(() => ({ status, user, customer, login, logout, reloadCustomer }), [status, user, customer, login, logout, reloadCustomer]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
