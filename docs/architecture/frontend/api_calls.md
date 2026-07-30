# API Call Strategy

## Core rule

**Never call the upstream backend API directly from the browser.** The browser calls same-origin Next.js endpoints under `app/api/`; these requests and responses are expected to be visible in the browser's network tab.

The server-to-server request from Next.js to the upstream API must not be exposed to the browser. This includes the upstream base URL, authentication token, private headers, and any internal response or error details that the client does not need.

All API communication goes through:
- **Next.js Route Handlers** (`app/api/`) for client-initiated requests
- **`lib/api.ts`** (the HTTP service) for all actual upstream calls — used by Route Handlers and Server Components alike

---

## Request flow

```
Browser → app/api/<resource>/route.ts → lib/api.ts → Upstream API
                                            ↑
                     handles the cookie token according to auth mode
```

Server Components skip the Route Handler and call `lib/api.ts` directly (server-to-server).

---

## The HTTP service (`lib/api.ts`)

A single server-side service that wraps `fetch`. All Route Handlers and Server Components use this — never call `fetch` directly against the upstream.

Responsibilities:
- Prepends `process.env.UPSTREAM_API_URL` to every request path
- Supports explicit `auth: "none" | "required" | "optional"` behavior for every call
- Reads the auth token from the HTTP-only cookie via `cookies()` from `next/headers` when authentication is required or optional
- Attaches `Authorization: Bearer <token>` only when the selected auth mode permits it
- Exposes `get`, `post`, `patch`, `del` methods

```ts
// lib/api.ts
import { cookies } from "next/headers";

const BASE_URL = process.env.UPSTREAM_API_URL!;

type AuthMode = "none" | "required" | "optional";

type RequestOptions = {
  auth: AuthMode;
};

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions,
  body?: unknown,
): Promise<T> {
  const token =
    options.auth === "none"
      ? undefined
      : (await cookies()).get("auth_token")?.value;

  if (options.auth === "required" && !token) {
    throw new Error("Authentication required");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options: RequestOptions) =>
    request<T>("GET", path, options),
  post: <T>(path: string, body: unknown, options: RequestOptions) =>
    request<T>("POST", path, options, body),
  patch: <T>(path: string, body: unknown, options: RequestOptions) =>
    request<T>("PATCH", path, options, body),
  del: <T>(path: string, options: RequestOptions) =>
    request<T>("DELETE", path, options),
};
```

Auth modes:
- **`none`** — never reads or sends the cookie token. Use for login and fully public endpoints.
- **`required`** — requires a cookie token and sends it to the upstream API. Use for protected endpoints.
- **`optional`** — sends the cookie token when present but allows the request without one. Use only when an endpoint deliberately supports both anonymous and authenticated behavior.

Every API call must choose an auth mode explicitly. Do not infer authentication requirements from the route name.

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

  const { token } = await api.post<{ token: string }>(
    "/auth/login",
    {
      email,
      password,
    },
    { auth: "none" },
  );

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

The `httpOnly: true` flag means browser JavaScript cannot read the cookie. The browser still sends the cookie automatically to matching Next.js routes, allowing the Next.js server to use the token without exposing it to client code.

---

## Authenticated Route Handlers

Route Handlers select the required auth mode. For protected calls, `lib/api.ts` requires the cookie and forwards its token to the upstream API. The upstream backend remains responsible for validating the token and authorizing access to the requested resource.

```ts
// app/api/users/route.ts
import { NextResponse } from "next/server";
import { api } from "@/lib/api";

export async function GET() {
  const users = await api.get<User[]>("/users", { auth: "required" });
  return NextResponse.json(users);
}
```

---

## Route Handler structure

Create a Route Handler for each browser-facing Next.js API path. A single `route.ts` may export multiple HTTP methods for that path. Use dynamic segments for individual resources and nested segments for explicit domain actions:

```text
app/api/users/route.ts
  GET   /api/users
  POST  /api/users

app/api/users/[id]/route.ts
  GET     /api/users/:id
  PATCH   /api/users/:id
  DELETE  /api/users/:id

app/api/orders/[id]/cancel/route.ts
  POST  /api/orders/:id/cancel
```

Route Handlers should expose only the operations and data required by the frontend. Do not create a generic catch-all proxy to the upstream API.

---

## Rules

- One `route.ts` per browser-facing API path, with dynamic or nested segments where appropriate. No catch-all upstream proxy.
- All upstream calls go through `lib/api.ts` — never call `fetch` against the upstream directly.
- Upstream base URL and all secrets live in server-only environment variables. Never hardcode or send them to the client.
- Return only data the browser needs and sanitize upstream errors before responding.
- Every `lib/api.ts` call explicitly sets `auth` to `none`, `required`, or `optional`.
- The auth token lives exclusively in an HTTP-only cookie. Never store it in `localStorage`, `sessionStorage`, or component state.
- The upstream backend validates authentication and resource-level authorization; Route Handlers and `proxy.ts` do not replace those checks.
- Server Components call `lib/api.ts` directly — they do not go through Route Handlers.
- Route Handlers exist only for client-initiated requests.
