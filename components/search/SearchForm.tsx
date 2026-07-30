"use client";

import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";

import { SearchField } from "@/components/search/SearchField";
import { SearchSubmitButton } from "@/components/search/SearchSubmitButton";
import { Button } from "@/components/ui/Button";

export type SearchFormValues = {
  where: string;
  checkIn: string;
  guests: string;
};

type SearchFormProps = {
  className?: string;
  initialWhere?: string;
  /** When true, clear actions navigate home (active URL search). */
  isActiveSearch?: boolean;
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
  className = "",
  initialWhere = "",
  isActiveSearch = false,
}: SearchFormProps) {
  const router = useRouter();

  const initialValues: SearchFormValues = {
    where: initialWhere,
    checkIn: "",
    guests: "",
  };

  const resetSearch = () => {
    router.push("/");
  };

  return (
    <section className={`mb-xl ${className}`.trim()}>
      <Formik<SearchFormValues>
        initialValues={initialValues}
        enableReinitialize
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          const q = values.where.trim();
          router.push(`/search?q=${encodeURIComponent(q)}`);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => {
          const validationMessage =
            (touched.where && errors.where) ||
            (touched.guests && errors.guests) ||
            null;

          const hasWhere = Boolean(values.where.trim());
          const showClearSearch = isActiveSearch || hasWhere;

          return (
            <div className="relative mx-auto max-w-4xl">
              <Form className="flex flex-col items-center justify-between gap-2 rounded-3xl border border-outline-variant bg-surface p-2 shadow-lg md:flex-row">
                <SearchField
                  name="where"
                  label="Where"
                  placeholder="Search destinations"
                  className="w-full md:w-1/3"
                  clearable
                  onClear={() => {
                    if (isActiveSearch) {
                      resetSearch();
                      return;
                    }

                    void setFieldValue("where", "");
                  }}
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
              {showClearSearch ? (
                <div className="mt-3 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-full px-4 py-1.5 font-label-sm text-label-sm"
                    onClick={() => {
                      if (isActiveSearch) {
                        resetSearch();
                        return;
                      }

                      void setFieldValue("where", "");
                      void setFieldValue("guests", "");
                      void setFieldValue("checkIn", "");
                    }}
                  >
                    Clear search
                  </Button>
                </div>
              ) : null}
              {validationMessage ? (
                <p
                  role="alert"
                  className="mt-2 text-center font-label-sm text-label-sm text-error"
                >
                  {validationMessage}
                </p>
              ) : null}
            </div>
          );
        }}
      </Formik>
    </section>
  );
}
