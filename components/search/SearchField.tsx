"use client";

import { Field, type FieldProps } from "formik";

type SearchFieldProps = {
  label: string;
  placeholder: string;
  name: string;
  className?: string;
  readOnly?: boolean;
  inputMode?: "text" | "numeric";
};

export function SearchField({
  label,
  placeholder,
  name,
  className = "",
  readOnly = false,
  inputMode = "text",
}: SearchFieldProps) {
  return (
    <div className={className}>
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <label className="flex w-full cursor-text flex-col items-start rounded-full px-6 py-2 text-left transition-colors hover:bg-surface-container-high">
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
                readOnly ? "cursor-default" : ""
              }`}
            />
          </label>
        )}
      </Field>
    </div>
  );
}
