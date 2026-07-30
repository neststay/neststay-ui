"use client";

import { Form, Formik } from "formik";

import { DEFAULT_LISTINGS_PAGE_SIZE } from "@/lib/constants/config";
import { mapSearchResultsToCardData } from "@/lib/mappers/property";
import type { PaginationMetaDto } from "@/lib/types/api";
import type { PropertyCardData } from "@/lib/types/property-card";
import type { SearchResponseDto } from "@/lib/types/property";
import { SearchField } from "@/components/search/SearchField";
import { SearchSubmitButton } from "@/components/search/SearchSubmitButton";

export type SearchFormValues = {
  where: string;
  checkIn: string;
  guests: string;
};

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

type SearchFormProps = {
  onResults?: (results: SearchResultsPayload) => void;
  className?: string;
  initialPlaceTypeName?: string;
};

const initialValues: SearchFormValues = {
  where: "",
  checkIn: "",
  guests: "",
};

function validate(values: SearchFormValues) {
  const errors: Partial<Record<keyof SearchFormValues, string>> = {};

  if (!values.where.trim()) {
    errors.where = "Enter a destination";
  }

  if (values.guests.trim()) {
    const guestCount = Number.parseInt(values.guests, 10);

    if (!Number.isFinite(guestCount) || guestCount < 1) {
      errors.guests = "Guests must be at least 1";
    }
  }

  return errors;
}

export function SearchForm({
  onResults,
  className = "",
  initialPlaceTypeName,
}: SearchFormProps) {
  return (
    <section className={`mb-xl ${className}`.trim()}>
      <Formik<SearchFormValues>
        initialValues={initialValues}
        validate={validate}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(undefined);

          const params = new URLSearchParams({
            q: values.where.trim(),
            page: "1",
            limit: String(DEFAULT_LISTINGS_PAGE_SIZE),
          });

          if (values.guests.trim()) {
            params.set("numberOfGuests", values.guests.trim());
          }

          if (initialPlaceTypeName) {
            params.set("placeTypeName", initialPlaceTypeName);
          }

          try {
            const response = await fetch(`/api/search?${params.toString()}`);

            if (!response.ok) {
              const body = (await response.json().catch(() => null)) as {
                error?: string;
              } | null;
              setStatus(body?.error ?? "Search failed. Please try again.");
              return;
            }

            const data = (await response.json()) as SearchResponseDto;

            onResults?.({
              items: mapSearchResultsToCardData(data.items),
              meta: data.meta,
              searchId: data.searchId,
              query: {
                q: values.where.trim(),
                ...(values.guests.trim()
                  ? { numberOfGuests: values.guests.trim() }
                  : {}),
                ...(initialPlaceTypeName
                  ? { placeTypeName: initialPlaceTypeName }
                  : {}),
              },
            });
          } catch {
            setStatus("Search failed. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status, errors, touched }) => {
          const validationMessage =
            (touched.where && errors.where) ||
            (touched.guests && errors.guests) ||
            null;

          return (
          <div className="relative mx-auto max-w-4xl">
            <Form className="flex flex-col items-center justify-between gap-2 rounded-3xl border border-outline-variant bg-surface p-2 shadow-lg md:flex-row">
              <SearchField
                name="where"
                label="Where"
                placeholder="Search destinations"
                className="w-full md:w-1/3"
              />
              <div
                aria-hidden="true"
                className="hidden h-8 w-px bg-outline-variant md:block"
              />
              <SearchField
                name="checkIn"
                label="Check in"
                placeholder="Add dates"
                className="w-full md:w-1/4"
                readOnly
              />
              <div
                aria-hidden="true"
                className="hidden h-8 w-px bg-outline-variant md:block"
              />
              <SearchField
                name="guests"
                label="Who"
                placeholder="Add guests"
                className="w-full md:w-1/3"
                inputMode="numeric"
              />
              <SearchSubmitButton disabled={isSubmitting} />
            </Form>
            {validationMessage ? (
              <p
                role="alert"
                className="mt-2 text-center font-label-sm text-label-sm text-error"
              >
                {validationMessage}
              </p>
            ) : null}
            {status ? (
              <p
                role="alert"
                className="mt-2 text-center font-label-sm text-label-sm text-error"
              >
                {status}
              </p>
            ) : null}
          </div>
          );
        }}
      </Formik>
    </section>
  );
}
