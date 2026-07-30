# Frontend Architecture

This directory documents architectural decisions for the frontend. Read these before adding new UI.

## Decisions

- [common_rules.md](./common_rules.md) — cross-cutting conventions (domain types in `lib/`, no duplicated unions in components)
- `lib/utils.ts` — shared helpers (form validators, URL/format checks, and other reusable logic). Do not define these inline in components.
- [components.md](./components.md) — reusable UI components and when to use them (includes heading conventions)
- [icons.md](./icons.md) — SVG icons: `Icon` for UI glyphs, `components/icons/` for brand and standalone icons
- [forms.md](./forms.md) — how forms are structured and the standalone component pattern
- [../security.md](../security.md) — route authorization via proxy.ts (protected routes, cookie auth)
- [api_calls.md](./api_calls.md) — full API call strategy: HTTP service, auth token cookie, Route Handler pattern
