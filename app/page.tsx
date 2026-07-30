import { api, ApiError } from "@/lib/api";
import {
  DEFAULT_LISTINGS_PAGE_SIZE,
  DEFAULT_LOCATION_ID,
} from "@/lib/constants/config";
import { mapPropertyListToCardData } from "@/lib/mappers/property";
import type { PaginationMetaDto, ResponseApiDto } from "@/lib/types/api";
import type { PaginatedPropertyListDto } from "@/lib/types/property";
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

async function getInitialListings() {
  try {
    const response = await api.get<ResponseApiDto<PaginatedPropertyListDto>>(
      `/properties?locationId=${DEFAULT_LOCATION_ID}&page=1&limit=${DEFAULT_LISTINGS_PAGE_SIZE}`,
      { auth: "none" },
    );

    return {
      properties: mapPropertyListToCardData(response.data.items),
      meta: response.data.meta,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? "Unable to load properties. Please try again later."
        : "Unable to load properties. Please try again later.";

    return {
      properties: [],
      meta: EMPTY_META,
      error: message,
    };
  }
}

export default async function HomePage() {
  const { properties, meta, error } = await getInitialListings();

  return (
    <HomePageContent
      initialProperties={properties}
      initialMeta={meta}
      fetchError={error}
    />
  );
}
