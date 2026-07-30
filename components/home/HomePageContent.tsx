"use client";

import { useRef } from "react";

import type { CategoryItem } from "@/lib/constants/categories";
import { DEFAULT_LISTINGS_PAGE_SIZE } from "@/lib/constants/config";
import { mapSearchResultsToCardData } from "@/lib/mappers/property";
import type { PaginationMetaDto } from "@/lib/types/api";
import type { PropertyCardData } from "@/lib/types/property-card";
import type { SearchResponseDto } from "@/lib/types/property";
import { PageContainer } from "@/components/layout/PageContainer";
import { CategoryFilterBar } from "@/components/navigation/CategoryFilterBar";
import {
  PropertyListingSection,
  type PropertyListingSectionHandle,
  type SearchResultsPayload,
} from "@/components/property/PropertyListingSection";
import { SearchForm } from "@/components/search/SearchForm";

type HomePageContentProps = {
  initialProperties: PropertyCardData[];
  initialMeta: PaginationMetaDto;
  fetchError?: string | null;
  initialWhere?: string;
  initialSearchQuery?: SearchResultsPayload["query"];
};

export function HomePageContent({
  initialProperties,
  initialMeta,
  fetchError = null,
  initialWhere = "",
  initialSearchQuery,
}: HomePageContentProps) {
  const listingRef = useRef<PropertyListingSectionHandle>(null);

  const handleCategorySelect = async (category: CategoryItem) => {
    const params = new URLSearchParams({
      q: category.label,
      page: "1",
      limit: String(DEFAULT_LISTINGS_PAGE_SIZE),
    });

    if (category.placeTypeName) {
      params.set("placeTypeName", category.placeTypeName);
    }

    try {
      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as SearchResponseDto;

      listingRef.current?.applySearchResults({
        items: mapSearchResultsToCardData(data.items),
        meta: data.meta,
        searchId: data.searchId,
        query: {
          q: category.label,
          ...(category.placeTypeName
            ? { placeTypeName: category.placeTypeName }
            : {}),
        },
      });
    } catch {
      // Category filter failures leave the current grid unchanged.
    }
  };

  return (
    <>
      <CategoryFilterBar onCategorySelect={handleCategorySelect} />
      <PageContainer as="main" className="py-xl">
        {fetchError ? (
          <p
            role="alert"
            className="mb-md rounded-xl bg-error-container px-4 py-3 font-body-md text-body-md text-on-error-container"
          >
            {fetchError}
          </p>
        ) : null}
        <SearchForm
          initialWhere={initialWhere}
          isActiveSearch={Boolean(initialSearchQuery)}
        />
        <PropertyListingSection
          ref={listingRef}
          initialProperties={initialProperties}
          initialMeta={initialMeta}
          initialSearchQuery={initialSearchQuery}
        />
      </PageContainer>
    </>
  );
}
