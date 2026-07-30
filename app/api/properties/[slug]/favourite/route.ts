import { NextRequest, NextResponse } from "next/server";

import { api, ApiError } from "@/lib/api";
import type { ResponseApiDto } from "@/lib/types/api";
import type { FavouriteResponseDto } from "@/lib/types/property";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const response = await api.post<ResponseApiDto<FavouriteResponseDto>>(
      `/properties/${encodeURIComponent(slug)}/favourite`,
      undefined,
      { auth: "required" },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      if (error.status === 404) {
        return NextResponse.json({ error: "Property not found" }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Unable to update favourite" },
        { status: error.status >= 500 ? 502 : error.status },
      );
    }

    return NextResponse.json(
      { error: "Unable to update favourite" },
      { status: 502 },
    );
  }
}
