import type { PaginationMetaDto } from "@/lib/types/api";

export type PropertyImageDto = {
  url: string;
  order: number;
};

export type PropertyResponseDto = {
  slug: string;
  name: string;
  description: string;
  nightlyRate: string;
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  createdAt: string;
  updatedAt: string;
  images: PropertyImageDto[];
  isFavourited: boolean;
};

export type PaginatedPropertyListDto = {
  items: PropertyResponseDto[];
  meta: PaginationMetaDto;
};

export type FacetCountItemDto = {
  value: string;
  count: number;
};

export type SearchFacetsDto = {
  locationName: FacetCountItemDto[];
  placeTypeName: FacetCountItemDto[];
  numberOfGuests: FacetCountItemDto[];
  numberOfBedrooms: FacetCountItemDto[];
  numberOfBathrooms: FacetCountItemDto[];
};

export type SearchResultItemDto = {
  slug: string;
  name: string;
  description: string;
  nightlyRate: number;
  numberOfGuests: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  locationName: string;
  placeTypeName: string;
  imageUrls: string[];
  createdAt: number;
};

export type SearchResponseDto = {
  searchId: string;
  items: SearchResultItemDto[];
  facets: SearchFacetsDto;
  meta: PaginationMetaDto;
};

export type FavouriteResponseDto = {
  slug: string;
  isFavourite: boolean;
};
