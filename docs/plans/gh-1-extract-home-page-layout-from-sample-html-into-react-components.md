# Extract home page layout from sample.html into React components — Implementation Plan

> **Source:** [GitHub #1](https://github.com/neststay/neststay-ui/issues/1)
> **Created:** 2026-07-30

---

## 1. Proposal

### What

Convert `sample.html` into a structured Next.js home page composed of reusable React components. The page is a property exploration/listing view with six regions: sticky header, category filter bar, hero search, property grid with load-more, footer, and mobile bottom navigation.

The repo is currently a bare Next.js 16 starter (`app/page.tsx` placeholder). This ticket bootstraps the design system (Tailwind tokens, Inter font, `Icon`, `Heading`), layout chrome, the home page composition, and **live property data from the Neststay backend API**.

### Why

- Establishes the visual foundation and component library for Nest Stay.
- Replaces the static HTML prototype with maintainable, architecture-compliant React code.
- Wires the home page to real listings via the upstream `/properties` and `/search` endpoints.
- Keeps pages as thin composition shells so future routes plug in without restructuring.

### Scope

**In scope:**
- Migrate design tokens from `sample.html` (lines 9–102) into `app/globals.css` (`@theme inline`, Tailwind v4).
- Create shared primitives: `Heading`, `Icon`, `Button`, `PageContainer`.
- Extract all six page regions into components per the ticket's folder structure.
- **API layer:** `lib/api.ts`, Route Handlers under `app/api/`, upstream types, and mappers from API DTOs → card UI props.
- **Initial listings:** Server Component fetch via `lib/api.ts` → `GET /properties?locationId=…`.
- **Search:** `SearchForm` submit → client fetch → `GET /api/search` → upstream `GET /search`.
- **Load more:** Client pagination via `GET /api/properties?page=…`.
- **Favourites toggle:** `FavoriteButton` → `POST /api/properties/[slug]/favourite` (auth required; graceful 401 when logged out).
- Wire `app/layout.tsx` (global chrome) and `app/page.tsx` (home content).
- Client interactivity: header scroll shadow, category tab selection, favorite toggle, search form (Formik).
- Configure Next.js for remote property/logo images; placeholder when API returns empty `images[]`.
- `UPSTREAM_API_URL` env var pointing at `http://localhost:3000`.

**Out of scope:**
- Real date-picker / guest-picker modals (search submits text + guest count only for now).
- Login/register UI (favourite toggle shows optimistic local state or toast on 401).
- Separate footer link components (array-driven links in `Footer` is sufficient).
- Separate `WhereField` / `DatesField` / `WhoField` (one `SearchField` with props).
- Dedicated scroll-shadow component (inline hook in `Header`).
- Dark mode polish beyond token availability (sample supports `class="light"` only).
- Property detail page (`GET /properties/{slug}`) — link cards optionally, page itself not built here.

---

## 2. Design

### Architecture approach

Follow `docs/architecture/frontend/` conventions:

| Pattern | Application |
|---------|-------------|
| **Server Components by default** | `Logo`, `Footer`, `PageContainer`, `PropertyGrid`, `PropertyCard` shell; **initial property list fetched in `page.tsx` via `lib/api.ts`** |
| **Small client islands** | `FavoriteButton`, `SearchForm`, `PropertyGrid` load-more wrapper, `CategoryFilterBar`, `Header`, `MobileBottomNav`, `Navigation` |
| **`Heading` instead of bare tags** | Property titles use `<Heading level="h3" … />`, not `<h3>` |
| **`Icon` registry** | Replace all Material Symbols `<span>` with `<Icon name="…" />` SVG paths |
| **Standalone forms** | `SearchForm` owns all form state via Formik; submit calls `/api/search`, not upstream |
| **Domain types in `lib/`** | Upstream DTOs in `lib/types/property.ts`; UI card props in `lib/types/property-card.ts` or mapped inline |
| **Browser never hits upstream** | All client calls go to `/api/properties`, `/api/search`, `/api/properties/[slug]/favourite` |

**Page flow:**

```
layout.tsx (Header, Footer, MobileBottomNav)
  └─ page.tsx (Server: fetch page 1 listings)
       ├─ CategoryFilterBar (client: filters → re-search or client filter)
       ├─ SearchForm (client: submit → /api/search → PropertyGrid update)
       └─ PropertyGridWithPagination (client: load more → /api/properties)
```

**Dev port note:** The upstream API runs on `http://localhost:3000`. Run the Next.js dev server on a different port (e.g. `npm run dev -- -p 3001`) to avoid conflict. Set `UPSTREAM_API_URL=http://localhost:3000` in `.env.local`.

### Component division

| Piece | Responsibility | Location |
|-------|----------------|----------|
| `PageContainer` | Shared max-width + horizontal padding wrapper | `components/layout/PageContainer.tsx` |
| `Logo` | Brand image + wordmark link; `variant="full" \| "text"` | `components/navigation/Logo.tsx` |
| `NavLink` | Active vs inactive desktop nav link styles | `components/navigation/NavLink.tsx` |
| `Navigation` | Array-driven desktop nav from `NAV_ITEMS` | `components/navigation/Navigation.tsx` |
| `HeaderActions` | Host CTA, language button, user menu pill | `components/navigation/HeaderActions.tsx` |
| `Header` | Sticky top bar; composes Logo, Navigation, HeaderActions; scroll shadow | `components/layout/Header.tsx` |
| `CategoryTab` | Single category pill with icon + label | `components/navigation/CategoryTab.tsx` |
| `CategoryFilterBar` | Horizontally scrollable sticky category row; maps to `placeTypeName` search filter | `components/navigation/CategoryFilterBar.tsx` |
| `SearchField` | Label + placeholder button/input segment | `components/search/SearchField.tsx` |
| `SearchSubmitButton` | Primary circular search CTA | `components/search/SearchSubmitButton.tsx` |
| `SearchForm` | Formik form: where / dates / guests + submit → `/api/search` | `components/search/SearchForm.tsx` |
| `FavoriteButton` | Heart toggle; POST `/api/properties/[slug]/favourite` | `components/property/FavoriteButton.tsx` |
| `PropertyRating` | Star icon + numeric rating | `components/property/PropertyRating.tsx` |
| `PropertyPrice` | Formatted nightly price | `components/property/PropertyPrice.tsx` |
| `PropertyCard` | Single listing card (server shell + client FavoriteButton) | `components/property/PropertyCard.tsx` |
| `PropertyGrid` | Responsive grid mapping `PropertyCardData[]` | `components/property/PropertyGrid.tsx` |
| `PropertyListingSection` | Client wrapper: holds listing state, load-more, search results | `components/property/PropertyListingSection.tsx` |
| `Button` | Generic button variants (load more, etc.) | `components/ui/Button.tsx` |
| `Heading` | Semantic heading wrapper (architecture prerequisite) | `components/Heading.tsx` |
| `Icon` | SVG icon registry (architecture prerequisite) | `components/Icon.tsx` |
| `Footer` | Brand, legal links, locale/currency row | `components/layout/Footer.tsx` |
| `MobileNavItem` | Single mobile tab item | `components/navigation/MobileNavItem.tsx` |
| `MobileBottomNav` | Fixed bottom tab bar (mobile only) | `components/layout/MobileBottomNav.tsx` |

### New files

**Foundation**
- `components/Heading.tsx` — `level`, `text`, `className` props per `components.md`
- `components/Icon.tsx` — `IconName` union + `paths` map
- `components/ui/Button.tsx` — variants for primary, inverse, ghost
- `components/layout/PageContainer.tsx`

**Layout & navigation** — (same as before)

**Search & property**
- `components/search/SearchForm.tsx`, `SearchField.tsx`, `SearchSubmitButton.tsx`
- `components/property/PropertyCard.tsx`, `PropertyGrid.tsx`, `PropertyListingSection.tsx`
- `components/property/FavoriteButton.tsx`, `PropertyRating.tsx`, `PropertyPrice.tsx`

**API layer**
- `lib/api.ts` — HTTP service per `api_calls.md`
- `lib/types/api.ts` — `ResponseApiDto`, `PaginationMetaDto`
- `lib/types/property.ts` — upstream DTOs: `PropertyResponseDto`, `PaginatedPropertyListDto`, `SearchResponseDto`, `SearchResultItemDto`, `FavouriteResponseDto`
- `lib/types/property-card.ts` — UI-facing `PropertyCardData` (title, imageUrl, price, slug, isFavourited, …)
- `lib/mappers/property.ts` — `toPropertyCardData(dto)` handles string `nightlyRate`, empty images, missing rating
- `lib/constants/navigation.ts`, `lib/constants/categories.ts`
- `lib/constants/config.ts` — `DEFAULT_LOCATION_ID` (default `1` until locations API exists)

**Route Handlers**
- `app/api/properties/route.ts` — `GET` proxy to upstream `/properties`
- `app/api/search/route.ts` — `GET` proxy to upstream `/search`
- `app/api/properties/[slug]/favourite/route.ts` — `POST` proxy to upstream `/properties/{slug}/favourite`

**Env**
- `.env.local.example` — `UPSTREAM_API_URL=http://localhost:3000`

### Modified files

- `app/globals.css` — design tokens, utilities, body defaults
- `app/layout.tsx` — Inter font, metadata, global chrome
- `app/page.tsx` — Server fetch initial listings; pass to `PropertyListingSection`
- `next.config.ts` — `images.remotePatterns` for API image hosts + prototype URLs
- `package.json` — add `formik`

### Files to touch (summary)

```
.env.local.example
app/globals.css
app/layout.tsx
app/page.tsx
app/api/properties/route.ts
app/api/search/route.ts
app/api/properties/[slug]/favourite/route.ts
next.config.ts
package.json
lib/api.ts
lib/types/api.ts
lib/types/property.ts
lib/types/property-card.ts
lib/mappers/property.ts
lib/constants/navigation.ts
lib/constants/categories.ts
lib/constants/config.ts
components/Heading.tsx
components/Icon.tsx
components/ui/Button.tsx
components/layout/PageContainer.tsx
components/layout/Header.tsx
components/layout/Footer.tsx
components/layout/MobileBottomNav.tsx
components/navigation/Logo.tsx
components/navigation/Navigation.tsx
components/navigation/NavLink.tsx
components/navigation/HeaderActions.tsx
components/navigation/CategoryFilterBar.tsx
components/navigation/CategoryTab.tsx
components/navigation/MobileNavItem.tsx
components/search/SearchForm.tsx
components/search/SearchField.tsx
components/search/SearchSubmitButton.tsx
components/property/PropertyCard.tsx
components/property/PropertyGrid.tsx
components/property/PropertyListingSection.tsx
components/property/FavoriteButton.tsx
components/property/PropertyRating.tsx
components/property/PropertyPrice.tsx
```

---

## 3. Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Icons | SVG `Icon` component, not Material Symbols font | `icons.md` forbids inline SVG in pages |
| Property titles | `Heading level="h3"` | `components.md` forbids bare `<h3>` |
| Search form library | Add `formik` dependency | `forms.md` mandates Formik |
| Data source | Live API via `lib/api.ts` | User requirement; mock data removed as primary source |
| Initial listing fetch | Server Component in `page.tsx` calls `lib/api.ts` directly | Server Components skip Route Handlers per `api_calls.md` |
| Client pagination / search | Route Handlers at `/api/properties`, `/api/search` | Client-initiated requests must not call upstream |
| Default `locationId` | `1` via `lib/constants/config.ts` | Upstream `GET /properties` requires `locationId`; no locations endpoint in scope |
| Upstream base URL | `UPSTREAM_API_URL=http://localhost:3000` | User-provided; never exposed to browser |
| Dev ports | Backend `:3000`, frontend `:3001` | Avoid port collision |
| API → card mapping | `lib/mappers/property.ts` | Upstream shape differs from sample.html card fields |
| `nightlyRate` type | Parse upstream string to number for display | API returns `"199.99"` string on list endpoint |
| Rating display | Omit rating on cards when API has no rating field | `PropertyResponseDto` has no rating; do not fabricate data |
| Subtitle / dates | Use `description` truncated as subtitle; omit date line | API has no distance/dates fields from prototype |
| Empty images | Show placeholder image from `public/` | API listings may return `"images": []` |
| Favourite toggle | POST with `auth: "required"`; local optimistic UI + revert on 401 | Upstream requires bearer token; login UI out of scope |
| Category tabs | Map labels to `placeTypeName` search filter where possible | Aligns with `/search` facets; fallback to client-side label filter |
| Search `q` param | Use "Where" field value; default `q=*` or location name if empty | Upstream requires `q`; confirm wildcard behavior or use `"resort"` as minimum |
| Load more | Use `meta.nextPage` from pagination | Upstream returns `PaginationMetaDto` with `isLastPage`, `nextPage` |

No unresolved ticket-vs-architecture conflicts.

---

## 4. API wiring

> Follow [api_calls.md](../architecture/frontend/api_calls.md): browser → `app/api/` → `lib/api.ts` → upstream.

### Swagger / API docs

- **URL:** http://localhost:3000/docs-json
- **Upstream base:** `http://localhost:3000` (via `UPSTREAM_API_URL`)

### Endpoints

| Operation | Upstream path | Auth mode | Route Handler | Notes |
|-----------|---------------|-----------|---------------|-------|
| List properties (initial SSR) | `GET /properties?locationId={id}&page&limit` | `none` | *(none — Server Component calls `lib/api.ts` directly)* | `locationId` required |
| List properties (client load-more) | `GET /properties?locationId={id}&page&limit` | `none` | `app/api/properties/route.ts` | Forwards query params |
| Search properties | `GET /search?q&locationName&placeTypeName&numberOfGuests&page&limit&…` | `none` | `app/api/search/route.ts` | `q` required |
| Toggle favourite | `POST /properties/{slug}/favourite` | `required` | `app/api/properties/[slug]/favourite/route.ts` | 401 when not logged in |

### Request / response shapes

```ts
// lib/types/api.ts
export type ResponseApiDto<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginationMetaDto = {
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
};

// lib/types/property.ts — upstream DTOs (from OpenAPI)
export type PropertyImageDto = { url: string; order: number };

export type PropertyResponseDto = {
  slug: string;
  name: string;
  description: string;
  nightlyRate: string;
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  createdAt: string;
  updatedAt: string;
  images: PropertyImageDto[];
  isFavourited: boolean;
};

export type PaginatedPropertyListDto = {
  items: PropertyResponseDto[];
  meta: PaginationMetaDto;
};

export type SearchResultItemDto = {
  slug: string;
  name: string;
  description: string;
  nightlyRate: number;
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  locationName: string;
  placeTypeName: string;
  imageUrls: string[];
  createdAt: number;
};

export type SearchResponseDto = {
  searchId: string;
  items: SearchResultItemDto[];
  facets: Record<string, { value: string; count: number }[]>;
  meta: PaginationMetaDto;
};

export type FavouriteResponseDto = {
  slug: string;
  isFavourite: boolean;
};

// lib/types/property-card.ts — UI card props
export type PropertyCardData = {
  slug: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  pricePerNight: number;
  currency: string;
  isFavourited: boolean;
};
```

Example upstream list response (`GET /properties?locationId=1`):

```json
{
  "success": true,
  "message": "Properties fetched successfully",
  "data": {
    "items": [{ "slug": "…", "name": "…", "nightlyRate": "199.99", "images": [], "isFavourited": false, … }],
    "meta": { "currentPage": 1, "isLastPage": false, "nextPage": 2, … }
  }
}
```

### Client integration

| Consumer | Pattern |
|----------|---------|
| `app/page.tsx` | `async` Server Component: `api.get<PaginatedPropertyListDto>("/properties?locationId=1&page=1&limit=8", { auth: "none" })` → map → pass `initialProperties` + `initialMeta` to `PropertyListingSection` |
| `PropertyListingSection` | Client state for items + meta; "Show more" fetches `GET /api/properties?locationId=1&page=${nextPage}&limit=8` |
| `SearchForm` | On submit: `GET /api/search?q=…&numberOfGuests=…&page=1&limit=8` → replace grid items |
| `FavoriteButton` | `POST /api/properties/${slug}/favourite` → update `isFavourited` from response |

### Error handling

- Route Handlers catch upstream errors; return sanitized JSON (`{ error: "Unable to load properties" }`) with appropriate status (502/503 for upstream failure, 422 passthrough message for validation).
- Never forward upstream base URL, stack traces, or raw NestJS error objects to the browser.
- `page.tsx`: if initial fetch fails, render empty state with retry message (no crash).
- `FavoriteButton`: on 401, revert optimistic toggle; optional inline hint ("Sign in to save favourites").
- Validate required query params in Route Handlers before calling upstream (`locationId` for properties, `q` for search).

---

## 5. Tasks

### Section A: Design tokens and shared primitives

- [ ] Migrate color, spacing, typography, and border-radius tokens from `sample.html` lines 9–102 into `app/globals.css` `@theme inline`
- [ ] Add `.hide-scrollbar` utility and set `body` to `bg-surface text-on-surface`
- [ ] Replace Geist fonts with Inter in `app/layout.tsx` via `next/font/google`
- [ ] Create `components/Heading.tsx` per `components.md`
- [ ] Create `components/Icon.tsx` with all icon names used in `sample.html`
- [ ] Create `components/ui/Button.tsx` with primary and inverse variants
- [ ] Create `components/layout/PageContainer.tsx`

### Section B: API layer, types, and mappers

- [ ] Add `.env.local.example` with `UPSTREAM_API_URL=http://localhost:3000`
- [ ] Create `lib/api.ts` per `api_calls.md` (`get`, `post`, `patch`, `del`; explicit `auth` mode)
- [ ] Create `lib/types/api.ts`, `lib/types/property.ts`, `lib/types/property-card.ts`
- [ ] Create `lib/mappers/property.ts` — map `PropertyResponseDto` and `SearchResultItemDto` → `PropertyCardData`
- [ ] Create `lib/constants/config.ts` with `DEFAULT_LOCATION_ID = 1`
- [ ] Add `lib/constants/navigation.ts` and `lib/constants/categories.ts`
- [ ] Create `app/api/properties/route.ts` — forward `locationId`, `page`, `limit` query params
- [ ] Create `app/api/search/route.ts` — forward search query params (`q` required)
- [ ] Create `app/api/properties/[slug]/favourite/route.ts` — `POST` with `auth: "required"`
- [ ] Configure `next.config.ts` `images.remotePatterns` for API image hosts

### Section C: Layout chrome (header, footer, mobile nav)

- [ ] Create `components/navigation/Logo.tsx` with `variant="full" | "text"`
- [ ] Create `components/navigation/NavLink.tsx` and `Navigation.tsx`
- [ ] Create `components/navigation/HeaderActions.tsx`
- [ ] Create `components/layout/Header.tsx` (client: scroll shadow toggle)
- [ ] Create `components/layout/Footer.tsx`
- [ ] Create `components/navigation/MobileNavItem.tsx` and `components/layout/MobileBottomNav.tsx`
- [ ] Update `app/layout.tsx`: metadata, Header, children, Footer, MobileBottomNav

### Section D: Category filter and search

- [ ] Install `formik`: `npm install formik`
- [ ] Create `components/navigation/CategoryTab.tsx` and `CategoryFilterBar.tsx`
- [ ] Create `components/search/SearchField.tsx` and `SearchSubmitButton.tsx`
- [ ] Create `components/search/SearchForm.tsx` — Formik; submit fetches `/api/search`, calls `onResults` callback

### Section E: Property listing grid (API-driven)

- [ ] Create `components/property/FavoriteButton.tsx` — POST `/api/properties/[slug]/favourite`
- [ ] Create `components/property/PropertyPrice.tsx` (omit `PropertyRating` or hide when no data)
- [ ] Create `components/property/PropertyCard.tsx` using `next/image`, `Heading`, placeholder for missing images
- [ ] Create `components/property/PropertyGrid.tsx`
- [ ] Create `components/property/PropertyListingSection.tsx` — client state, load-more via `/api/properties`, accepts search results from `SearchForm`
- [ ] Add public placeholder image for empty API images

### Section F: Home page composition and cleanup

- [ ] Rewrite `app/page.tsx`: server fetch initial listings via `lib/api.ts`; compose `CategoryFilterBar`, `SearchForm`, `PropertyListingSection`
- [ ] Remove starter Next.js placeholder content
- [ ] Visual pass against `sample.html`; verify real API data renders

---

## 6. Verification plan

### Manual testing

1. Start upstream API on `http://localhost:3000`; confirm `GET /properties?locationId=1` returns data.
2. Copy `.env.local.example` → `.env.local`; run frontend on port 3001: `npm run dev -- -p 3001`.
3. Open `http://localhost:3001` — property grid shows API listings (not static mock).
4. **Header / category bar / footer / mobile nav** — same checks as before.
5. **Search:** submit "Where" text → grid updates from `/api/search`; network tab shows only same-origin `/api/search`.
6. **Load more:** click "Show more" → appends next page; stops when `meta.isLastPage`.
7. **Favourite:** click heart → `POST /api/properties/{slug}/favourite`; toggles when authenticated, graceful handling when 401.
8. **Empty images:** cards with `images: []` show placeholder without broken layout.

### API checks

- [ ] Browser network tab shows only same-origin `/api/…` calls (never `localhost:3000` upstream URL)
- [ ] Initial page HTML includes server-rendered listings (view source or disable JS)
- [ ] Route Handlers return sanitized errors when upstream is down
- [ ] `GET /api/properties` without `locationId` returns 400 with clear message
- [ ] `GET /api/search` without `q` returns 400 with clear message

### Acceptance criteria (from ticket + API scope)

- [ ] `sample.html` layout converted to structured Next.js page with reusable components
- [ ] Six regions implemented: Header, CategoryFilterBar, SearchForm, PropertyGrid, Footer, MobileBottomNav
- [ ] Core components extracted: `Logo`, `Navigation`, `Header`, `SearchForm`, `PropertyCard`, `Footer`
- [ ] Design tokens migrated from sample into Tailwind theme
- [ ] `Heading`, `Icon`, Formik patterns followed
- [ ] **Property listings loaded from upstream `GET /properties`**
- [ ] **Search wired to upstream `GET /search` via Route Handler**
- [ ] **Favourite toggle wired to upstream `POST /properties/{slug}/favourite`**
- [ ] `app/page.tsx` remains composition-only (no form state; server fetch only for initial data)

### Regression

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] Frontend runs alongside backend without port conflict

### Commands

```bash
# Terminal 1 — upstream (already running)
curl "http://localhost:3000/properties?locationId=1"

# Terminal 2 — frontend
cp .env.local.example .env.local
npm install formik
npm run dev -- -p 3001
npm run lint
npm run build
```
