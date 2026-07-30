import { redirect } from "next/navigation";

import { api, ApiError } from "@/lib/api";
import { DEFAULT_LISTINGS_PAGE_SIZE } from "@/lib/constants/config";
import { mapSearchResultsToCardData } from "@/lib/mappers/property";
import type { PaginationMetaDto, ResponseApiDto } from "@/lib/types/api";
import type { SearchResponseDto } from "@/lib/types/property";
import { HomePageContent } from "@/components/home/HomePageContent";

const EMPTY_META: PaginationMetaDto = {
  currentPage: 1,
  isFirstPage: true,
  isLastPage: true,
  previousPage: null,
  nextPage: null,
  pageCount: 0,
  totalCount: 0,
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

async function getSearchResults(q: string) {
  try {
    const params = new URLSearchParams({
      q,
      page: "1",
      limit: String(DEFAULT_LISTINGS_PAGE_SIZE),
    });

    const response = await api.get<ResponseApiDto<SearchResponseDto>>(
      `/search?${params.toString()}`,
      { auth: "none" },
    );

    return {
      properties: mapSearchResultsToCardData(response.data.items),
      meta: response.data.meta,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? "Unable to search properties. Please try again later."
        : "Unable to search properties. Please try again later.";

    return {
      properties: [],
      meta: EMPTY_META,
      error: message,
    };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q)?.trim() ?? "";

  if (!q) {
    redirect("/");
  }

  const { properties, meta, error } = await getSearchResults(q);

  return (
    <HomePageContent
      initialProperties={properties}
      initialMeta={meta}
      fetchError={error}
      initialWhere={q}
      initialSearchQuery={{ q }}
    />
  );
}
