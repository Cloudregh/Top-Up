// Small per-device stores for things the API has no customer-facing list/field for yet.
const read = <T,>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(k) ?? "") as T; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* quota / private mode */ } };

export const prescriptionIds = {
  get: () => read<string[]>("topup.rx", []),
  add: (id: string) => write("topup.rx", [id, ...prescriptionIds.get().filter((x) => x !== id)]),
};
export interface Fulfilment { mode: "delivery" | "pickup"; where: string; phone: string }
export const fulfilment = {
  get: (orderId: string) => read<Fulfilment | null>(`topup.ful.${orderId}`, null),
  set: (orderId: string, f: Fulfilment) => write(`topup.ful.${orderId}`, f),
};
export const addresses = { get: () => read<string[]>("topup.addr", []), set: (a: string[]) => write("topup.addr", a) };
export const notifPrefs = {
  get: () => read("topup.notif", { orderUpdates: true, prescriptionUpdates: true, promotions: false }),
  set: (p: unknown) => write("topup.notif", p),
};
import { BRANCHES_LIST } from "./branches";
export const BRANCHES = BRANCHES_LIST.filter((b) => !b.wholesale).map((b) => b.name);
