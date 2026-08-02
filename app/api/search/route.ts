import { NextRequest, NextResponse } from "next/server";

import { api, ApiError } from "@/lib/api";
import type { ResponseApiDto } from "@/lib/types/api";
import type { SearchResponseDto } from "@/lib/types/property";

const ALLOWED_SEARCH_PARAMS = [
  "q",
  "locationName",
  "placeTypeName",
  "minNightlyRate",
  "maxNightlyRate",
  "numberOfGuests",
  "numberOfBedrooms",
  "numberOfBathrooms",
  "page",
  "limit",
] as const;

function buildSearchPath(searchParams: URLSearchParams): string | null {
  const query = searchParams.get("q");

  if (!query) {
    return null;
  }

  const params = new URLSearchParams();
  params.set("q", query);

  for (const key of ALLOWED_SEARCH_PARAMS) {
    if (key === "q") {
      continue;
    }

    const value = searchParams.get(key);

    if (value) {
      params.set(key, value);
    }
  }

  return `/search?${params.toString()}`;
}

export async function GET(req: NextRequest) {
  const upstreamPath = buildSearchPath(req.nextUrl.searchParams);

  if (!upstreamPath) {
    return NextResponse.json({ error: "q is required" }, { status: 400 });
  }

  try {
    const response = await api.get<ResponseApiDto<SearchResponseDto>>(
      upstreamPath,
      { auth: "optional" },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 422) {
        return NextResponse.json({ error: error.message }, { status: 422 });
      }

      return NextResponse.json(
        { error: "Unable to search properties" },
        { status: error.status >= 500 ? 502 : error.status },
      );
    }

    return NextResponse.json(
      { error: "Unable to search properties" },
      { status: 502 },
    );
  }
}
