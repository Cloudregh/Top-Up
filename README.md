# Top-Up Pharmacy — customer storefront

Next.js 16 (App Router) · Tailwind 4 · lucide-react · GSAP + ScrollTrigger · Lenis · anime.js.
Talks to the Pharma API (`docs/openapi.yaml`) through a same-origin proxy (`/api/v1/*` → `API_URL`),
so the httpOnly refresh cookie is first-party and there is no CORS.

```bash
cp .env.example .env.local   # then edit
npm run dev                  # http://localhost:3000
```

There is no mock mode: the app only calls routes defined in the OpenAPI file (Pharma Distribution API).

## Images (Pexels now, Cloudinary later)
All imagery goes through `lib/images.ts` (`img(key, w, h)`). Every key currently points at a Pexels placeholder.
To switch: upload each asset to Cloudinary with public id `topup/<key>` (keys listed in `IMAGE_KEYS`, e.g. `topup/hero`,
`topup/cat_cough`, `topup/delivery`), then set `NEXT_PUBLIC_IMAGE_SOURCE=cloudinary` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
Tip: the hero portrait uses `mix-blend-multiply`; a background-removed PNG (Cloudinary `e_background_removal`) will look cleaner.
Product photos: the catalogue API has no image field, so a neutral "Image soon" tile shows.

**Using Top-Up's own photos (e.g. from Instagram):** Instagram doesn't allow automated downloads, so save the photos you want
and drop them in `public/images/`, then map a key in `LOCAL` (`lib/images.ts`), e.g. `about_counter: "/images/tema-branch.jpg"`.
Current stand-ins are Pexels photos of Black/African subjects. Social link: `NEXT_PUBLIC_INSTAGRAM_URL` (footer + contact page).

## Site structure (from top-uppharmacy.com)
Home · About (About Us, Why Choose Us, FAQ's) · Services · Health Hub (Prescriptions, Book Appointment, Corporate Health, Travel Health) ·
News · Careers · Contact · Shop. Enquiry forms (appointment, corporate, travel, careers, contact) open WhatsApp prefilled — no forms backend yet.
Copy on Corporate/Travel Health and Careers is placeholder: replace with Top-Up's real wording.

## Screens
Home · Shop (search, category, cursor pagination) · Product · Cart (live stock/price re-check) · Checkout (delivery/pickup,
prescription, Paystack) · Order detail (timeline, payment polling, cancel) · Orders (+reorder) · Prescriptions ·
Account (business details, credit, statement, invoices, addresses, notifications) · Login · Register · Support widget.

## What's real vs placeholder
See **[docs/API-GAPS.md](docs/API-GAPS.md)**. Everything the API provides is used live; everything it doesn't is a placeholder wrapped in `<Pending waitingFor="…">`.
Set `NEXT_PUBLIC_SHOW_PLACEHOLDERS=1` to outline them with the endpoint each is waiting for.

## Env
See `.env.example` (Cloudinary unsigned preset needed for prescription file upload; otherwise a paste-a-link fallback is shown).
