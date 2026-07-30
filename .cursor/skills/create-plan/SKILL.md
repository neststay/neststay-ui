---
name: create-plan
description: Fetches a GitHub issue by ID or URL and writes a detailed frontend implementation plan to docs/plans/gh-<number>-<title-slug>.md. Use when the user asks to create a plan from a GitHub ticket, issue, or URL, or mentions /create-plan.
---

# Create Plan

Produce a detailed implementation plan from a GitHub ticket, grounded in this repo's frontend architecture.

**Announce at start:** "Using create-plan to draft the implementation plan from the GitHub ticket."

## Inputs

Require **one** of:
- GitHub issue number (e.g. `42`)
- Full GitHub issue URL (e.g. `https://github.com/org/repo/issues/42`)
- Swagger / OpenAPI URL for upstream API docs

If the user did not provide a ticket, ask for it before proceeding.

## Workflow

### 1. Fetch the ticket

Use `gh` to load the issue:

```bash
# From issue number (repo inferred from git remote)
gh issue view <number> --json title,body,labels,comments,url

# From URL
gh issue view <url> --json title,body,labels,comments,url
```

Extract: title, description, acceptance criteria, labels, linked PRs, and relevant comment context.

### 2. Read architecture docs (mandatory)

Read `docs/architecture/frontend/index.md` first, then every doc it links to that applies to the ticket:

| Doc | Read when |
|-----|-----------|
| `docs/architecture/frontend/common_rules.md` | Always |
| `docs/architecture/frontend/components.md` | UI components, layout, headings |
| `docs/architecture/frontend/icons.md` | Icons |
| `docs/architecture/frontend/forms.md` | Forms, inputs, validation |
| `docs/architecture/frontend/api_calls.md` | Any API integration |

Also skim relevant existing code (pages, components, route handlers) before proposing changes.

### 3. Resolve conflicts

**Architecture docs always outrank the ticket.**

When the ticket conflicts with architecture docs (e.g. direct browser→upstream fetch, bare `<h1>` tags, inline validators instead of `lib/utils.ts`):

1. Do **not** silently follow the ticket.
2. Use AskQuestion or ask the user which approach to take.
3. Record the outcome in the **Decisions** section.

### 4. Gather API docs

If the ticket involves backend integration:

- Use the Swagger/OpenAPI URL if the user provided one.
- Otherwise ask the user for it before finalizing the **API wiring** section.

Map each needed operation to: upstream path, auth mode (`none` | `required` | `optional`), Route Handler path under `app/api/`, and client call pattern — per `docs/architecture/frontend/api_calls.md`.

### 5. Write the plan

The final output **must** be a markdown file saved inside `docs/plans/`.

**Filename format:** `gh-<XX>-<YYYY>.md`

| Part | Source |
|------|--------|
| `XX` | GitHub issue number (digits only, no `#`) |
| `YYYY` | Issue title from the ticket, slugified for the filesystem |

**Slugify the title:** lowercase, spaces → hyphens, remove characters other than letters, numbers, and hyphens, collapse repeated hyphens, trim leading/trailing hyphens.

**Example:** issue `#42` titled `Add user login page` → `docs/plans/gh-42-add-user-login-page.md`

Create `docs/plans/` if it does not exist. Use [plan-template.md](plan-template.md) for structure. Fill every section; omit a section only when genuinely not applicable (note why).

### 6. Present to user

Share the full path (e.g. `docs/plans/gh-42-add-user-login-page.md`) and a brief summary. Ask whether to adjust before implementation.

## Plan quality bar

- **Proposal** — clear problem, user value, and scope boundaries.
- **Design** — concrete architecture, component split, new vs modified files with paths.
- **Decisions** — explicit choices and trade-offs (including conflict resolutions).
- **API wiring** — endpoint table: upstream path, auth mode, Route Handler, request/response shapes, error handling.
- **Tasks** — small, checkbox-ready items grouped into logical sections (one section = one coherent slice of the requirement).
- **Verification** — manual steps, commands, and acceptance checks tied to the ticket.

## Task section rules

- Use markdown checkboxes: `- [ ] Task description`
- Group tasks under `##` section headings that match delivery order
- Each section should be independently completable and verifiable
- Prefer 2–5 minute steps; split large steps
- Name files and symbols in task descriptions where helpful

## Verification rules

Include:
- How to run the dev server and reach affected pages
- API/network checks (browser → `app/api/` only, never upstream URL in browser)
- Edge cases from the ticket
- Regression areas for modified code

## Do not

- Call upstream APIs directly from client components in the plan
- Propose patterns forbidden by architecture docs without flagging a conflict
- Produce a plan without reading `index.md` and applicable linked docs
- Skip asking the user when ticket and architecture disagree
