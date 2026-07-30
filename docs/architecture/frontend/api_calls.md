# API Call Strategy

## Core rule

**Never call external or internal APIs directly from the browser.** API URLs, credentials, and request payloads must not be visible in the network tab.

All API communication goes through:
- **Next.js Route Handlers** (`app/api/`) for client-initiated requests
- **`lib/api.ts`** (the HTTP service) for all actual upstream calls — used by Route Handlers and Server Components alike

---

## Request flow

```
Browser → app/api/<resource>/route.ts → lib/api.ts → Upstream API
                                            ↑
                          reads auth token from HTTP-only cookie
```

Server Components skip the Route Handler and call `lib/api.ts` directly (server-to-server).

---

## The HTTP service (`lib/api.ts`)

A single server-side service that wraps `fetch`. All Route Handlers and Server Components use this — never call `fetch` directly against the upstream.

Responsibilities:
- Prepends `process.env.UPSTREAM_API_URL` to every request path
- Reads the auth token from the HTTP-only cookie via `cookies()` from `next/headers`
- Attaches `Authorization: Bearer <token>` on every call automatically
- Exposes `get`, `post`, `patch`, `del` methods

```ts
// lib/api.ts
import { cookies } from "next/headers";

const BASE_URL = process.env.UPSTREAM_API_URL!;

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = (await cookies()).get("auth_token")?.value;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  get:   <T>(path: string) => request<T>("GET", path),
  post:  <T>(path: string, body: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  del:   <T>(path: string) => request<T>("DELETE", path),
};
```

---

## Authentication — login flow

The login Route Handler is the only place that sets the cookie. It must:
1. Receive credentials from the browser
2. Call the upstream auth endpoint via `lib/api.ts` (no token needed here)
3. Set the returned token as an **HTTP-only** cookie on the response
4. Return only a success status to the browser — never the token itself

```ts
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { token } = await api.post<{ token: string }>("/auth/login", {
    email,
    password,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res;
}
```

The `httpOnly: true` flag means browser JavaScript cannot read the cookie — only the Next.js server can, which is the only place the token is ever needed.

---

## Authenticated Route Handlers

Route Handlers do not handle auth themselves — `lib/api.ts` reads the cookie automatically.

```ts
// app/api/users/route.ts
import { NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function GET() {
  const users = await api.get<User[]>("/users");
  return NextResponse.json(users);
}
```

---

## Rules

- One `route.ts` per resource domain (`app/api/users/route.ts`, `app/api/orders/route.ts`). No catch-all proxy.
- All upstream calls go through `lib/api.ts` — never call `fetch` against the upstream directly.
- Upstream base URL and all secrets in environment variables only. Never hardcoded, never sent to the client.
- The auth token lives exclusively in an HTTP-only cookie. Never store it in `localStorage`, `sessionStorage`, or component state.
- Server Components call `lib/api.ts` directly — they do not go through Route Handlers.
- Route Handlers exist only for client-initiated requests.
