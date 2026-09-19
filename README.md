# Top-Up Pharmacy — customer storefront

Next.js 16 (App Router) · Tailwind 4 · lucide-react · GSAP + ScrollTrigger · Lenis · anime.js.
Talks to the Pharma API (`docs/openapi.yaml`) through a same-origin proxy (`/api/v1/*` → `API_URL`),
so the httpOnly refresh cookie is first-party and there is no CORS.

```bash
cp .env.example .env.local   # then edit
npm run dev                  # http://localhost:3000
```

Set `NEXT_PUBLIC_DEMO=1` to run the whole customer flow against an in-browser mock (any email/password logs in).

## Images (Pexels now, Cloudinary later)
All imagery goes through `lib/images.ts` (`img(key, w, h)`). Every key currently points at a Pexels placeholder.
To switch: upload each asset to Cloudinary with public id `topup/<key>` (keys listed in `IMAGE_KEYS`, e.g. `topup/hero`,
`topup/cat_cough`, `topup/delivery`), then set `NEXT_PUBLIC_IMAGE_SOURCE=cloudinary` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
Tip: the hero portrait uses `mix-blend-multiply`; a background-removed PNG (Cloudinary `e_background_removal`) will look cleaner.
Product photos are placeholders by product type (`productImageKey`) — replace with per-product images once the API serves them.

## Site structure (from top-uppharmacy.com)
Home · About (About Us, Why Choose Us, FAQ's) · Services · Health Hub (Prescriptions, Book Appointment, Corporate Health, Travel Health) ·
News · Careers · Contact · Shop. Enquiry forms (appointment, corporate, travel, careers, contact) open WhatsApp prefilled — no forms backend yet.
Copy on Corporate/Travel Health and Careers is placeholder: replace with Top-Up's real wording.

## Screens
Home · Shop (search, category, cursor pagination) · Product · Cart (live stock/price re-check) · Checkout (delivery/pickup,
prescription, Paystack) · Order detail (timeline, payment polling, cancel) · Orders (+reorder) · Prescriptions ·
Account (business details, credit, statement, invoices, addresses, notifications) · Login · Register · Support widget.

## Backend gaps the UI works around (flag to backend)
- **Catalogue needs a token**, so signed-out visitors see a labelled preview (mock names, no prices/stock).
- **No self-registration endpoint** — `/register` hands the application to the team on WhatsApp.
- **Delivery address / pickup branch have no field** on `POST /orders`; they're stored on-device per order. `location_id` can't be chosen (no customer-readable locations list).
- **No `GET /prescriptions` list** — ids are tracked on-device; each is fetched by id.
- **Credit payments** aren't exposed for customer orders (option shown disabled).
- **Category filter** maps to `products.form` (Tablet, Capsule, Syrup, Cream, Drops, Injection) — no taxonomy yet.
- `GET /customers/{id}/statement`, `/invoices/{id}` and `PATCH /customers/{id}` are staff-auth in the OpenAPI; the UI degrades gracefully if a customer token is refused.
- Paystack is stub-only on the backend; the redirect + polling flow is built but unverified live.
- **Support widget**: instant in-panel reply, then WhatsApp / phone (numbers from the live site). There is no in-app live-chat backend.

## Env
See `.env.example` (Cloudinary unsigned preset needed for prescription file upload; otherwise a paste-a-link fallback is shown).
