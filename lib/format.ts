export const ghs = (pesewa: number) =>
  `₵${(pesewa / 100).toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const fmtDate = (iso: string, withTime = false) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });

export const shortId = (id: string) => id.slice(0, 8).toUpperCase();

export const SUPPORT = {
  whatsapp: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "233242226555",
  phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "233242226555",
  phone2: process.env.NEXT_PUBLIC_SUPPORT_PHONE_2 || "233240021200",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "",
};
export const pretty = (n: string) => `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;

// The API's `category` filter matches products.form (no taxonomy exists yet).
export const CATEGORIES = [
  { value: "Tablet", label: "Tablets", icon: "pill" },
  { value: "Capsule", label: "Capsules", icon: "capsule" },
  { value: "Syrup", label: "Syrups", icon: "syrup" },
  { value: "Cream", label: "Creams & gels", icon: "cream" },
  { value: "Drops", label: "Drops", icon: "drops" },
  { value: "Injection", label: "Injectables", icon: "syringe" },
] as const;
