"use client";

import { Form, Formik } from "formik";
import { useState } from "react";

import { Heading } from "@/components/Heading";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/Button";

type SignUpFormValues = {
  fullName: string;
  email: string;
  password: string;
};

type SignUpFormProps = {
  onLoginClick?: () => void;
};

function validate(values: SignUpFormValues) {
  const errors: Partial<Record<keyof SignUpFormValues, string>> = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}

const inputClassName =
  "w-full rounded-lg border border-outline bg-surface px-4 py-3 font-body-md text-body-md outline-none transition-all focus:border-on-surface focus:ring-0";

export function SignUpForm({ onLoginClick }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-[0_4px_24px_-2px_rgba(40,23,24,0.08)] md:p-xl">
      <div className="mb-lg text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Icon
            name="nest_multi_room"
            filled
            className="h-8 w-8 text-on-primary"
          />
        </div>
        <Heading
          level="h1"
          text="Create an account"
          className="mb-2 font-headline-lg text-headline-lg text-on-surface"
        />
        <p className="font-body-md text-body-md text-on-surface-variant">
          Join Nest Stay to discover unique homes worldwide.
        </p>
      </div>

      <Formik<SignUpFormValues>
        initialValues={{ fullName: "", email: "", password: "" }}
        validate={validate}
        onSubmit={(_values, { setSubmitting }) => {
          setSubmitting(false);
        }}
      >
        {({
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          values,
        }) => (
          <Form className="space-y-md">
            <div className="space-y-1">
              <label
                htmlFor="signup-full-name"
                className="ml-1 font-label-md text-label-md text-on-surface-variant"
              >
                Full Name
              </label>
              <input
                id="signup-full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClassName}
              />
              {touched.fullName && errors.fullName ? (
                <p className="ml-1 font-label-sm text-label-sm text-error">
                  {errors.fullName}
                </p>
              ) : null}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-email"
                className="ml-1 font-label-md text-label-md text-on-surface-variant"
              >
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClassName}
              />
              {touched.email && errors.email ? (
                <p className="ml-1 font-label-sm text-label-sm text-error">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-password"
                className="ml-1 font-label-md text-label-md text-on-surface-variant"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${inputClassName} pr-12`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-on-surface-variant transition-colors hover:text-on-surface"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <Icon
                    name={showPassword ? "visibility_off" : "visibility"}
                    className="h-5 w-5"
                  />
                </button>
              </div>
              {touched.password && errors.password ? (
                <p className="ml-1 font-label-sm text-label-sm text-error">
                  {errors.password}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg py-4 font-headline-md text-headline-md hover:bg-primary-container active:scale-[0.98]"
            >
              Sign up
            </Button>
          </Form>
        )}
      </Formik>

      <div className="relative my-lg">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center font-label-sm uppercase tracking-wider">
          <span className="bg-surface-container-lowest px-4 text-on-surface-variant">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mb-lg grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-lg border border-outline px-4 py-3 font-label-md text-label-md transition-colors hover:bg-surface-container-low active:scale-95"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-3 rounded-lg border border-outline px-4 py-3 font-label-md text-label-md transition-colors hover:bg-surface-container-low active:scale-95"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </button>
      </div>

      <p className="mb-6 text-center font-label-sm text-label-sm text-on-surface-variant">
        By signing up, you agree to our{" "}
        <a className="text-primary hover:underline" href="#">
          Terms and Conditions
        </a>{" "}
        and{" "}
        <a className="text-primary hover:underline" href="#">
          Privacy Policy
        </a>
        .
      </p>

      <div className="border-t border-outline-variant pt-4 text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-on-surface transition-all hover:underline"
            onClick={onLoginClick}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="#1877F2"
      />
    </svg>
  );
}
