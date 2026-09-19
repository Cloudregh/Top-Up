// In-browser stand-in for the customer API. Used (a) as a labelled preview
// catalogue for signed-out visitors and (b) for the whole flow when
// NEXT_PUBLIC_DEMO=1. Never used for real orders.
import type { CatalogueItem, Customer, CustomerOrder, OrderTracking, Payment, Prescription, Statement, Invoice } from "./types";

const P = (i: number, name: string, form: string, pack: string, price: number,
  availability: CatalogueItem["availability"] = "in_stock", rx = false): CatalogueItem => ({
  product_id: `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`,
  name, form, pack_size: pack, price_pesewa: price, availability, requires_prescription: rx,
});

export const MOCK_CATALOGUE: CatalogueItem[] = [
  P(1, "Paracetamol 500mg", "Tablet", "Pack of 20", 1200),
  P(2, "Ibuprofen 400mg", "Tablet", "Pack of 30", 2400),
  P(3, "Vitaced Complete A-Z", "Tablet", "30 tablets", 8500),
  P(4, "Amoxicillin 500mg", "Capsule", "Pack of 21", 4200, "low", true),
  P(5, "Omeprazole 20mg", "Capsule", "Pack of 14", 3100),
  P(6, "Cod Liver Oil", "Capsule", "60 softgels", 6900),
  P(7, "Benylin Cough Syrup", "Syrup", "100ml", 3800),
  P(8, "Coartem Antimalarial", "Tablet", "Pack of 24", 5600, "in_stock", true),
  P(9, "Zinc Sulphate Syrup", "Syrup", "60ml", 2100, "low"),
  P(10, "Hydrocortisone 1%", "Cream", "15g tube", 2900),
  P(11, "Clotrimazole Cream", "Cream", "20g tube", 2500),
  P(12, "Saline Nasal Drops", "Drops", "10ml", 1800),
  P(13, "Chloramphenicol Eye Drops", "Drops", "10ml", 2200, "out_of_stock"),
  P(14, "Diclofenac Injection", "Injection", "3 x 3ml", 4800, "in_stock", true),
  P(15, "Vitamin C 1000mg", "Tablet", "Pack of 60", 5200),
  P(16, "ORS Sachets", "Tablet", "Pack of 10", 1500),
  P(17, "Tramadol 50mg", "Capsule", "Pack of 10", 3600, "in_stock", true),
  P(18, "Ventolin Inhaler", "Drops", "200 doses", 7400, "low", true),
];

const SS = () => (typeof window !== "undefined" ? window.sessionStorage : null);
const load = <T,>(k: string, d: T): T => { try { return JSON.parse(SS()?.getItem(k) ?? "") as T; } catch { return d; } };
const save = (k: string, v: unknown) => SS()?.setItem(k, JSON.stringify(v));
const uid = () => crypto.randomUUID();
const CUSTOMER_ID = "11111111-1111-4111-8111-111111111111";

function problem(status: number, title: string, detail?: string, code?: string): never {
  // Lazy import avoids a circular dependency with api.ts.
  const err = Object.assign(new Error(detail || title), { status, title, detail, code, name: "ApiError" });
  throw err;
}

function handle<T>(path: string, method: string, body: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => { try { resolve(route(path, method, body) as T); } catch (e) { reject(e); } }, 250);
  });
}

function route(fullPath: string, method: string, body: any): unknown {
  const [path, qs = ""] = fullPath.split("?");
  const q = new URLSearchParams(qs);
  const orders = load<CustomerOrder[]>("demo.orders", []);
  const presc = load<(Prescription & { _t: number })[]>("demo.presc", []);

  if (path === "/customer/auth/login") {
    if (!body?.email || !body?.password) problem(400, "Bad request", "Email and password are required");
    save("demo.session", true);
    return { access_token: "demo", token_type: "Bearer", expires_in: 900 };
  }
  if (path === "/customer/auth/logout") { SS()?.removeItem("demo.session"); return undefined; }
  if (path === "/customer/me")
    return { id: uid(), email: "demo@top-uppharmacy.com", name: "Ama Mensah", customer_id: CUSTOMER_ID, org_id: uid() };
  if (path === `/customers/${CUSTOMER_ID}` && method === "GET")
    return { id: CUSTOMER_ID, name: "Mensah Community Clinic", kind: "clinic", price_tier_id: null,
      credit_limit_pesewa: 500000, licence_no: "PC/2231/24", licence_expiry: "2027-03-31", licence_status: "valid" } satisfies Customer;
  if (path === `/customers/${CUSTOMER_ID}` && method === "PATCH") return { ...body };
  if (path === `/customers/${CUSTOMER_ID}/statement`) {
    const charges = orders.filter((o) => o.status !== "cancelled");
    return { customer_id: CUSTOMER_ID, balance_pesewa: charges.reduce((s, o) => s + (o.payment_status === "paid" ? 0 : o.total_pesewa), 0),
      entries: charges.map((o) => ({ entry_type: "charge", amount_pesewa: o.total_pesewa, ref_doc_type: "invoice", ref_doc_id: o.id, created_at: o.created_at })) } satisfies Statement;
  }
  if (path.startsWith("/invoices/")) {
    const o = orders.find((x) => x.id === path.split("/")[2]);
    if (!o) problem(404, "Not found");
    return { id: o.id, customer_id: CUSTOMER_ID, total_pesewa: o.total_pesewa, status: o.payment_status === "paid" ? "paid" : "issued",
      issued_at: o.created_at, customer_order_id: o.id,
      lines: o.lines.map((l) => ({ ...l, line_total_pesewa: l.quantity * l.unit_price_pesewa })) } satisfies Invoice;
  }

  if (path === "/catalogue") {
    const term = (q.get("q") || "").toLowerCase(), cat = (q.get("category") || "").toLowerCase();
    const all = MOCK_CATALOGUE.filter((p) => (!term || p.name.toLowerCase().includes(term)) && (!cat || p.form?.toLowerCase() === cat));
    const start = Number(q.get("cursor") || 0), limit = Number(q.get("limit") || 12);
    return { data: all.slice(start, start + limit), next_cursor: start + limit < all.length ? String(start + limit) : null };
  }
  if (path.startsWith("/catalogue/")) {
    const p = MOCK_CATALOGUE.find((x) => x.product_id === path.split("/")[2]);
    return p ?? problem(404, "Product not found");
  }

  if (path === "/prescriptions" && method === "POST") {
    const p = { id: uid(), customer_id: CUSTOMER_ID, file_url: body.file_url, status: "pending" as const, note: null, reviewed_by: null, created_at: new Date().toISOString(), _t: Date.now() };
    save("demo.presc", [p, ...presc]); return p;
  }
  if (path.startsWith("/prescriptions/")) {
    const p = presc.find((x) => x.id === path.split("/")[2]);
    if (!p) problem(404, "Prescription not found");
    if (p.status === "pending" && Date.now() - p._t > 8000) { // pharmacist "reviews" after 8s
      p.status = "approved"; p.note = "Verified. Valid for one order."; save("demo.presc", presc);
    }
    return p;
  }

  if (path === "/orders" && method === "POST") {
    const lines = (body.lines as { product_id: string; quantity: number }[]).map((l) => {
      const p = MOCK_CATALOGUE.find((x) => x.product_id === l.product_id) ?? problem(404, "Unknown product");
      if (p.availability === "out_of_stock") problem(422, "Insufficient stock", `${p.name} is out of stock`, "insufficient-stock");
      if (p.requires_prescription && !body.prescription_id) problem(422, "Prescription required", `${p.name} needs an approved prescription`, "prescription-required");
      return { product_id: l.product_id, quantity: l.quantity, unit_price_pesewa: p.price_pesewa };
    });
    const o: CustomerOrder = { id: uid(), customer_id: CUSTOMER_ID, status: "placed", payment_status: "unpaid", fulfilment_status: "pending",
      total_pesewa: lines.reduce((s, l) => s + l.quantity * l.unit_price_pesewa, 0), lines, created_at: new Date().toISOString() };
    save("demo.orders", [o, ...orders]); return o;
  }
  if (path === "/orders") return { data: orders, next_cursor: null };
  const m = path.match(/^\/orders\/([^/]+)(\/tracking|\/cancel)?$/);
  if (m) {
    const o = orders.find((x) => x.id === m[1]);
    if (!o) problem(404, "Order not found");
    if (m[2] === "/cancel") {
      if (o.status !== "placed") problem(409, "Order not cancellable", "A paid order can't be cancelled online — contact support.", "order-not-cancellable");
      o.status = "cancelled"; save("demo.orders", orders); return o;
    }
    if (m[2] === "/tracking") {
      const t = new Date(o.created_at).getTime();
      const history = [{ status: "placed", at: o.created_at }];
      if (o.payment_status === "paid") history.push({ status: "paid", at: new Date(t + 60000).toISOString() });
      if (o.status === "fulfilled") history.push({ status: "fulfilled", at: new Date(t + 600000).toISOString() });
      if (o.status === "cancelled") history.push({ status: "cancelled", at: new Date(t + 30000).toISOString() });
      return { order_id: o.id, status: o.status, history } satisfies OrderTracking;
    }
    return o;
  }
  if (path === "/payments" && method === "POST") {
    const o = orders.find((x) => x.id === body.customer_order_id);
    if (!o) problem(404, "Order not found");
    o.payment_status = "paid"; o.status = "paid"; save("demo.orders", orders);
    return { id: uid(), customer_order_id: o.id, provider: "paystack", provider_ref: "demo", amount_pesewa: o.total_pesewa,
      status: "pending", redirect_url: `/orders/${o.id}?pay=1` } satisfies Payment;
  }
  return problem(404, "Not Found", `Demo mode has no route for ${method} ${path}`);
}

export const mockApi = { handle, hasSession: () => !!load("demo.session", false) };
