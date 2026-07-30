import { NextRequest, NextResponse } from "next/server";

import { api, ApiError } from "@/lib/api";
import type { ResponseApiDto } from "@/lib/types/api";
import type { PaginatedPropertyListDto } from "@/lib/types/property";

function buildPropertiesPath(searchParams: URLSearchParams): string | null {
  const locationId = searchParams.get("locationId");

  if (!locationId) {
    return null;
  }

  const params = new URLSearchParams();
  params.set("locationId", locationId);

  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  if (page) {
    params.set("page", page);
  }

  if (limit) {
    params.set("limit", limit);
  }

  return `/properties?${params.toString()}`;
}

export async function GET(req: NextRequest) {
  const upstreamPath = buildPropertiesPath(req.nextUrl.searchParams);

  if (!upstreamPath) {
    return NextResponse.json(
      { error: "locationId is required" },
      { status: 400 },
    );
  }

  try {
    const response = await api.get<ResponseApiDto<PaginatedPropertyListDto>>(
      upstreamPath,
      { auth: "none" },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 422) {
        return NextResponse.json({ error: error.message }, { status: 422 });
      }

      return NextResponse.json(
        { error: "Unable to load properties" },
        { status: error.status >= 500 ? 502 : error.status },
      );
    }

    return NextResponse.json(
      { error: "Unable to load properties" },
      { status: 502 },
    );
  }
}
