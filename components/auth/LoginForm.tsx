"use client";

import { Form, Formik } from "formik";
import { useState } from "react";

import { Heading } from "@/components/Heading";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/Button";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSignUpClick?: () => void;
  onSuccess?: () => void;
};

function validate(values: LoginFormValues) {
  const errors: Partial<Record<keyof LoginFormValues, string>> = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
}

const inputClassName =
  "w-full rounded-lg border border-outline-variant bg-surface-bright py-3 font-body-md text-body-md transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function LoginForm({ onSignUpClick, onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-lg shadow-[0_4px_24px_rgba(40,23,24,0.08)] md:p-xl">
      <div className="mb-lg flex flex-col items-center text-center">
        <div className="mb-md flex h-16 w-16 items-center justify-center rounded-xl bg-primary-container/10">
          <Icon
            name="holiday_village"
            filled
            className="h-10 w-10 text-primary"
          />
        </div>
        <Heading
          level="h1"
          text="Welcome back"
          className="mb-xs font-headline-lg text-headline-lg text-on-surface"
        />
        <p className="font-body-md text-body-md text-on-surface-variant">
          Log in to manage your bookings and find your next home.
        </p>
      </div>

      <Formik<LoginFormValues>
        initialValues={{ email: "", password: "" }}
        validate={validate}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(undefined);

          try {
            const response = await fetch("/api/auth/login", {
              method: "POST",
              credentials: "same-origin",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: values.email.trim(),
                password: values.password,
              }),
            });

            const body = (await response.json().catch(() => ({}))) as {
              error?: string;
            };

            if (!response.ok) {
              setStatus(body.error ?? "Unable to log in. Please try again.");
              return;
            }

            onSuccess?.();
          } catch {
            setStatus("Unable to log in. Please try again.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          touched,
          isSubmitting,
          status,
          handleChange,
          handleBlur,
          values,
        }) => {
          const emailError = touched.email && errors.email;
          const passwordError = touched.password && errors.password;

          return (
            <Form className="space-y-md">
              <div className="space-y-xs">
                <label
                  htmlFor="login-email"
                  className="ml-1 font-label-md text-label-md text-on-surface"
                >
                  Email address
                </label>
                <div className="group relative">
                  <Icon
                    name="mail"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary"
                  />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputClassName} pl-12 pr-4`}
                  />
                </div>
                {emailError ? (
                  <p className="ml-1 font-label-sm text-label-sm text-error">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="space-y-xs">
                <div className="flex items-center justify-between px-1">
                  <label
                    htmlFor="login-password"
                    className="font-label-md text-label-md text-on-surface"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="font-label-sm text-label-sm text-primary transition-all hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="group relative">
                  <Icon
                    name="lock"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary"
                  />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputClassName} pl-12 pr-12`}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-on-surface"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <Icon
                      name={showPassword ? "visibility_off" : "visibility"}
                      className="h-5 w-5"
                    />
                  </button>
                </div>
                {passwordError ? (
                  <p className="ml-1 font-label-sm text-label-sm text-error">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-md w-full rounded-lg py-4 shadow-sm hover:bg-primary-container hover:shadow-lg"
              >
                {isSubmitting ? "Logging in…" : "Log in"}
              </Button>
              {status ? (
                <p
                  role="alert"
                  className="text-center font-label-sm text-label-sm text-error"
                >
                  {status}
                </p>
              ) : null}
            </Form>
          );
        }}
      </Formik>

      <div className="relative my-lg flex items-center">
        <div className="grow border-t border-outline-variant" />
        <span className="px-md font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
          or
        </span>
        <div className="grow border-t border-outline-variant" />
      </div>

      <div className="grid grid-cols-1 gap-sm">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-sm rounded-lg border border-outline-variant px-4 py-3 transition-all duration-200 hover:bg-surface-container-low active:scale-[0.98]"
        >
          <GoogleIcon />
          <span className="font-label-md text-label-md text-on-surface">
            Continue with Google
          </span>
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-sm rounded-lg border border-outline-variant px-4 py-3 transition-all duration-200 hover:bg-surface-container-low active:scale-[0.98]"
        >
          <FacebookIcon />
          <span className="font-label-md text-label-md text-on-surface">
            Continue with Facebook
          </span>
        </button>
      </div>

      <div className="mt-lg border-t border-outline-variant/30 pt-lg text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          New to Nest Stay?{" "}
          <button
            type="button"
            className="font-label-md text-label-md text-primary transition-all hover:underline"
            onClick={onSignUpClick}
          >
            Sign up
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
