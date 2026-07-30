# [Ticket Title] — Implementation Plan

> **Source:** [GitHub #NNN](issue-url)
> **Created:** YYYY-MM-DD

---

## 1. Proposal

### What

[Describe what is being built or changed.]

### Why

[User/business value, problem being solved, link to ticket goals.]

### Scope

**In scope:**
- …

**Out of scope:**
- …

---

## 2. Design

### Architecture approach

[High-level approach aligned with docs/architecture/frontend/. Reference relevant patterns: Route Handlers, Server Components, form structure, etc.]

### Component division

| Piece | Responsibility | Location |
|-------|----------------|----------|
| … | … | `path/to/file` |

### New files

- `path/to/new-file` — …

### Modified files

- `path/to/existing-file` — …

### Files to touch (summary)

```
[list all paths]
```

---

## 3. Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| … | … | … |

[Include conflict resolutions with ticket vs architecture here.]

---

## 4. API wiring

> Follow [api_calls.md](../architecture/frontend/api_calls.md): browser → `app/api/` → `lib/api.ts` → upstream.

### Swagger / API docs

- **URL:** [swagger-url or "pending — ask user"]

### Endpoints

| Operation | Upstream path | Auth mode | Route Handler | Notes |
|-----------|---------------|-----------|---------------|-------|
| … | `GET /…` | `required` | `app/api/…/route.ts` | … |

### Request / response shapes

```ts
// Key types (place in lib/ per common_rules.md)
```

### Client integration

[How client components fetch data — which `/api/…` paths, when to use Server Components instead.]

### Error handling

[How upstream errors are sanitized before reaching the browser.]

---

## 5. Tasks

### Section A: [Logical slice name — e.g. "Domain types and API layer"]

- [ ] …
- [ ] …

### Section B: [Logical slice name — e.g. "Route Handlers"]

- [ ] …
- [ ] …

### Section C: [Logical slice name — e.g. "UI components and page"]

- [ ] …
- [ ] …

### Section D: [Logical slice name — e.g. "Polish and edge cases"]

- [ ] …
- [ ] …

---

## 6. Verification plan

### Manual testing

1. …
2. …

### API checks

- [ ] Browser network tab shows only same-origin `/api/…` calls
- [ ] …

### Acceptance criteria (from ticket)

- [ ] …
- [ ] …

### Regression

- [ ] …

### Commands

```bash
# dev server, lint, typecheck, tests as applicable
npm run dev
npm run lint
npm run typecheck
```
