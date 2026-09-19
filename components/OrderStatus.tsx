import type { CustomerOrder } from "@/lib/types";

const TONE: Record<string, string> = {
  placed: "bg-amber-50 text-amber-700", confirmed: "bg-sky-50 text-sky-700", paid: "bg-indigo-50 text-indigo-700",
  fulfilled: "bg-emerald-50 text-emerald-700", delivered: "bg-emerald-100 text-emerald-800", cancelled: "bg-rose-50 text-rose-700",
};
export const statusLabel = (o: CustomerOrder) => (o.status === "placed" ? "Awaiting payment" : o.status[0].toUpperCase() + o.status.slice(1));
export function StatusPill({ order }: { order: CustomerOrder }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${TONE[order.status] ?? "bg-mist"}`}>{statusLabel(order)}</span>;
}
