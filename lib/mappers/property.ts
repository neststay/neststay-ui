import {
  DEFAULT_CURRENCY,
  DEFAULT_PROPERTY_IMAGE,
} from "@/lib/constants/config";
import type { PropertyCardData } from "@/lib/types/property-card";
import type {
  PropertyResponseDto,
  SearchResultItemDto,
} from "@/lib/types/property";

function truncateDescription(description: string, maxLength = 80): string {
  if (description.length <= maxLength) {
    return description;
  }

  return `${description.slice(0, maxLength - 1).trimEnd()}…`;
}

function parseNightlyRate(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function pickPrimaryImageUrl(
  images: { url: string; order: number }[] | undefined,
  imageUrls: string[] | undefined,
): string {
  if (images?.length) {
    const sorted = [...images].sort((a, b) => a.order - b.order);
    return sorted[0]?.url ?? DEFAULT_PROPERTY_IMAGE;
  }

  if (imageUrls?.length) {
    return imageUrls[0] ?? DEFAULT_PROPERTY_IMAGE;
  }

  return DEFAULT_PROPERTY_IMAGE;
}

export function propertyResponseToCardData(
  property: PropertyResponseDto,
): PropertyCardData {
  return {
    slug: property.slug,
    title: property.name,
    subtitle: truncateDescription(property.description),
    imageUrl: pickPrimaryImageUrl(property.images, undefined),
    imageAlt: property.name,
    pricePerNight: parseNightlyRate(property.nightlyRate),
    currency: DEFAULT_CURRENCY,
    isFavourited: property.isFavourited,
  };
}

export function searchResultToCardData(
  result: SearchResultItemDto,
): PropertyCardData {
  return {
    slug: result.slug,
    title: result.name,
    subtitle: result.locationName
      ? `${result.locationName} · ${result.placeTypeName}`
      : truncateDescription(result.description),
    imageUrl: pickPrimaryImageUrl(undefined, result.imageUrls),
    imageAlt: result.name,
    pricePerNight: parseNightlyRate(result.nightlyRate),
    currency: DEFAULT_CURRENCY,
    isFavourited: false,
  };
}

export function mapPropertyListToCardData(
  properties: PropertyResponseDto[],
): PropertyCardData[] {
  return properties.map(propertyResponseToCardData);
}

export function mapSearchResultsToCardData(
  results: SearchResultItemDto[],
): PropertyCardData[] {
  return results.map(searchResultToCardData);
}
