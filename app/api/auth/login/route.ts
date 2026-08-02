import { NextRequest, NextResponse } from "next/server";

import { api, ApiError } from "@/lib/api";
import {
  AUTH_TOKEN_COOKIE,
  getAuthTokenCookieOptions,
} from "@/lib/auth-cookie";
import type { ResponseApiDto } from "@/lib/types/api";
import type { LoginResponseDto, LoginUserDto } from "@/lib/types/auth";

export async function POST(req: NextRequest) {
  let body: LoginUserDto;

  try {
    body = (await req.json()) as LoginUserDto;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  try {
    const response = await api.post<ResponseApiDto<LoginResponseDto>>(
      "/users/login",
      { email, password },
      { auth: "none" },
    );

    const res = NextResponse.json({
      ok: true,
      email: response.data.email,
    });

    res.cookies.set(
      AUTH_TOKEN_COOKIE,
      response.data.token,
      getAuthTokenCookieOptions(),
    );

    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: error.message || "Credentials don't match" },
          { status: 401 },
        );
      }

      if (error.status === 422) {
        return NextResponse.json(
          { error: error.message || "Validation failed" },
          { status: 422 },
        );
      }

      return NextResponse.json(
        { error: "Unable to log in" },
        { status: error.status >= 500 ? 502 : error.status },
      );
    }

    return NextResponse.json({ error: "Unable to log in" }, { status: 502 });
  }
}
