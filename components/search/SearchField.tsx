"use client";

import { Field, type FieldProps } from "formik";

import { Icon } from "@/components/Icon";

type SearchFieldProps = {
  label: string;
  placeholder: string;
  name: string;
  className?: string;
  readOnly?: boolean;
  inputMode?: "text" | "numeric";
  clearable?: boolean;
  onClear?: () => void;
};

export function SearchField({
  label,
  placeholder,
  name,
  className = "",
  readOnly = false,
  inputMode = "text",
  clearable = false,
  onClear,
}: SearchFieldProps) {
  return (
    <div className={className}>
      <Field name={name}>
        {({ field, meta }: FieldProps) => {
          const hasValue = Boolean(
            typeof field.value === "string" && field.value.trim(),
          );
          const showClear = clearable && hasValue && !readOnly;

          return (
            <label className="relative flex w-full cursor-text flex-col items-start rounded-full px-6 py-2 text-left transition-colors hover:bg-surface-container-high">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {label}
              </span>
              <input
                {...field}
                readOnly={readOnly}
                inputMode={inputMode}
                placeholder={placeholder}
                aria-invalid={meta.touched && Boolean(meta.error)}
                className={`w-full bg-transparent font-body-md text-body-md font-medium text-on-surface placeholder:text-on-surface-variant focus:outline-none ${
                  showClear ? "pr-8" : ""
                } ${readOnly ? "cursor-default" : ""}`}
              />
              {showClear ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onClear?.();
                  }}
                  aria-label={`Clear ${label}`}
                  className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              ) : null}
            </label>
          );
        }}
      </Field>
    </div>
  );
}
