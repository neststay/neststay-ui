"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
  useTransition,
} from "react";

import {
  DEFAULT_LISTINGS_PAGE_SIZE,
  DEFAULT_LOCATION_ID,
} from "@/lib/constants/config";
import {
  mapPropertyListToCardData,
  mapSearchResultsToCardData,
} from "@/lib/mappers/property";
import type { PaginationMetaDto } from "@/lib/types/api";
import type { PropertyCardData } from "@/lib/types/property-card";
import type {
  PaginatedPropertyListDto,
  SearchResponseDto,
} from "@/lib/types/property";
import { Button } from "@/components/ui/Button";
import { PropertyGrid } from "@/components/property/PropertyGrid";

export type SearchResultsPayload = {
  items: PropertyCardData[];
  meta: PaginationMetaDto;
  searchId: string;
  query: {
    q: string;
    numberOfGuests?: string;
    placeTypeName?: string;
  };
};

export type PropertyListingSectionHandle = {
  applySearchResults: (results: SearchResultsPayload) => void;
};

type ListingMode =
  | { type: "list"; locationId: number }
  | {
      type: "search";
      query: SearchResultsPayload["query"];
    };

type PropertyListingSectionProps = {
  initialProperties: PropertyCardData[];
  initialMeta: PaginationMetaDto;
  locationId?: number;
  /** When set, start in search mode so load-more uses /api/search. */
  initialSearchQuery?: SearchResultsPayload["query"];
};

export const PropertyListingSection = forwardRef<
  PropertyListingSectionHandle,
  PropertyListingSectionProps
>(function PropertyListingSection(
  {
    initialProperties,
    initialMeta,
    locationId = DEFAULT_LOCATION_ID,
    initialSearchQuery,
  },
  ref,
) {
  const [properties, setProperties] =
    useState<PropertyCardData[]>(initialProperties);
  const [meta, setMeta] = useState<PaginationMetaDto>(initialMeta);
  const [mode, setMode] = useState<ListingMode>(
    initialSearchQuery
      ? { type: "search", query: initialSearchQuery }
      : { type: "list", locationId },
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useImperativeHandle(ref, () => ({
    applySearchResults: (results) => {
      setProperties(results.items);
      setMeta(results.meta);
      setError(null);

      if (results.query) {
        setMode({ type: "search", query: results.query });
      }
    },
  }));

  const handleLoadMore = () => {
    if (meta.isLastPage || !meta.nextPage || isPending) {
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        if (mode.type === "list") {
          const params = new URLSearchParams({
            locationId: String(mode.locationId),
            page: String(meta.nextPage),
            limit: String(DEFAULT_LISTINGS_PAGE_SIZE),
          });

          const response = await fetch(`/api/properties?${params.toString()}`);

          if (!response.ok) {
            setError("Unable to load more properties.");
            return;
          }

          const data = (await response.json()) as PaginatedPropertyListDto;

          setProperties((current) => [
            ...current,
            ...mapPropertyListToCardData(data.items),
          ]);
          setMeta(data.meta);
          return;
        }

        const params = new URLSearchParams({
          q: mode.query.q,
          page: String(meta.nextPage),
          limit: String(DEFAULT_LISTINGS_PAGE_SIZE),
        });

        if (mode.query.numberOfGuests) {
          params.set("numberOfGuests", mode.query.numberOfGuests);
        }

        if (mode.query.placeTypeName) {
          params.set("placeTypeName", mode.query.placeTypeName);
        }

        const response = await fetch(`/api/search?${params.toString()}`);

        if (!response.ok) {
          setError("Unable to load more results.");
          return;
        }

        const data = (await response.json()) as SearchResponseDto;

        setProperties((current) => [
          ...current,
          ...mapSearchResultsToCardData(data.items),
        ]);
        setMeta(data.meta);
      } catch {
        setError("Unable to load more properties.");
      }
    });
  };

  return (
    <div className="flex flex-col">
      <PropertyGrid properties={properties} />

      {!meta.isLastPage ? (
        <div className="mt-xl flex flex-col items-center gap-sm">
          <Button
            variant="inverse"
            className="rounded-xl px-10 py-4"
            onClick={handleLoadMore}
            disabled={isPending}
          >
            {isPending ? "Loading…" : "Show more"}
          </Button>
          {error ? (
            <p className="font-label-sm text-label-sm text-error">{error}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
