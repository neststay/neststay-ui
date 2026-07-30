import { cookies } from "next/headers";

const BASE_URL = process.env.UPSTREAM_API_URL!;

export type AuthMode = "none" | "required" | "optional";

type RequestOptions = {
  auth: AuthMode;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as {
      message?: string | string[];
      error?: string;
    };

    if (Array.isArray(body.message)) {
      return body.message.join(", ");
    }

    if (typeof body.message === "string") {
      return body.message;
    }

    if (typeof body.error === "string") {
      return body.error;
    }
  } catch {
    // Fall through to generic message.
  }

  return "Request failed";
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions,
  body?: unknown,
): Promise<T> {
  if (!BASE_URL) {
    throw new ApiError("UPSTREAM_API_URL is not configured", 500);
  }

  const cookieStore = await cookies();
  const token =
    options.auth === "none"
      ? undefined
      : cookieStore.get("auth_token")?.value;

  if (options.auth === "required" && !token) {
    throw new ApiError("Authentication required", 401);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new ApiError(message, res.status);
  }

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
