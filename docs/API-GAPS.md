# What comes from the API vs. what is a placeholder

Set `NEXT_PUBLIC_SHOW_PLACEHOLDERS=1` to outline every placeholder region in the UI with an amber
"Awaiting API · …" badge. Customers never see the badges. Each placeholder is one `<Pending waitingFor="…">`
wrapper (grep for it) — remove the wrapper when the API supplies the data.

## Live from the API
| Surface | Endpoint(s) |
|---|---|
| Sign in / session / refresh / sign out | `POST /customer/auth/login · refresh · logout`, `GET /customer/me` |
| Catalogue (name, pack size, tier price, availability, Rx flag), search, category filter, pagination | `GET /catalogue`, `GET /catalogue/{id}` |
| Cart stock + price re-check | `GET /catalogue/{id}` |
| Place order / pay / cancel / history / status timeline | `POST /orders`, `POST /payments`, `POST /orders/{id}/cancel`, `GET /orders`, `GET /orders/{id}`, `GET /orders/{id}/tracking` |
| Prescription upload + review status + pharmacist note | `POST /prescriptions`, `GET /prescriptions/{id}` |
| Business details, tier, credit limit, licence + status | `GET /customers/{id}` |
| Statement, invoices | `GET /customers/{id}/statement`, `GET /invoices/{id}` |
| "Reorder your usuals" | `GET /orders` + `GET /catalogue` |

Signed-out visitors get **placeholder tiles** (no invented products) because `GET /catalogue` needs a token.

## Read from the API when present (fields don't exist yet)
`CatalogueItem.image_url` (product photos — a neutral "Image soon" placeholder shows until then),
`featured`, `best_seller` (home sections currently fall back to the first catalogue items), `category`.

## Placeholders — waiting on the API
| UI | Waiting for |
|---|---|
| Product photos | `image_url` on `GET /catalogue` (Cloudinary URL) |
| Featured / "Our Products" sections | `featured` / `best_seller` flags on `GET /catalogue` |
| Related products (product page) | related-products field/endpoint |
| Shop category chips | `GET /catalogue/categories` (chips are guesses at `products.form`) |
| Checkout delivery address / pickup branch | fields on `POST /orders` + customer-readable `GET /locations` (currently saved on-device per order, and the branch list is a constant) |
| Order "Delivery" card (ETA, live tracking, rider) | delivery detail on `GET /orders/{id}/tracking` (WP16) |
| Saved addresses, notification preferences | customer profile endpoints (kept on-device) |
| Prescriptions list | `GET /prescriptions` (ids kept on-device, each fetched by id) |
| Self-registration | `POST /customer/auth/register` (form hands off to WhatsApp) |
| Home hero hours/branches, campaigns, promo cards, services, insurers, awards, delivery banner, FAQs | CMS/content API |
| About, Why Choose Us, Services, News, FAQ, Careers, Corporate/Travel Health, Contact copy + locations | CMS/content API |
| Enquiry forms (appointment, corporate, travel, careers, contact) | `POST /enquiries` (currently WhatsApp hand-off) |
| Marketing photos | Cloudinary (Pexels stand-ins, see `lib/images.ts`) |

Not API concerns (config): support phone/WhatsApp numbers (`NEXT_PUBLIC_SUPPORT_*`), Cloudinary upload preset.
