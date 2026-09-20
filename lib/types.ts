// Mirrors docs/openapi.yaml (customer-facing subset). Money is pesewa integers.
export type Availability = "in_stock" | "low" | "out_of_stock";

export interface CatalogueItem {
  product_id: string;
  name: string;
  pack_size: string;
  price_pesewa: number;
  availability: Availability;
  requires_prescription: boolean;
}
export interface Page<T> { data: T[]; next_cursor: string | null }

export interface CustomerUser { id: string; email: string; name: string; customer_id: string; org_id: string }
export interface Customer {
  id: string; name: string; kind: "retail" | "wholesale" | "clinic" | "insurer";
  price_tier_id: string | null; credit_limit_pesewa: number;
  licence_no: string | null; licence_expiry: string | null;
  licence_status: "valid" | "expiring_soon" | "expired" | null;
}

export type OrderStatus = "placed" | "confirmed" | "paid" | "fulfilled" | "delivered" | "cancelled";
export interface OrderLine { product_id: string; quantity: number; unit_price_pesewa: number }
export interface CustomerOrder {
  id: string; customer_id: string; status: OrderStatus;
  payment_status: "unpaid" | "paid" | "refunded";
  fulfilment_status: "pending" | "fulfilled" | "failed";
  total_pesewa: number; lines: OrderLine[]; created_at: string;
}
export interface OrderTracking { order_id: string; status: string; history: { status: string; at: string }[] }

export interface Payment {
  id: string; customer_order_id: string; provider: "paystack" | "moolre" | "flutterwave";
  provider_ref: string | null; amount_pesewa: number;
  status: "pending" | "success" | "failed" | "expired"; redirect_url: string | null;
}

export interface Prescription {
  id: string; customer_id: string; file_url: string;
  status: "pending" | "approved" | "rejected"; note: string | null;
  reviewed_by: string | null; created_at: string;
}

export interface Statement {
  customer_id: string; balance_pesewa: number;
  entries: { entry_type: "charge" | "payment" | "adjustment"; amount_pesewa: number;
    ref_doc_type: string | null; ref_doc_id: string | null; created_at: string }[];
}
export interface Invoice {
  id: string; customer_id: string; total_pesewa: number;
  status: "issued" | "part_paid" | "paid" | "void"; issued_at: string;
  customer_order_id?: string | null;
  lines: { product_id: string; quantity: number; unit_price_pesewa: number; line_total_pesewa: number }[];
}
