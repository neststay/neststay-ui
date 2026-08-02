"use client";

import { useState } from "react";

import { LoginModal } from "@/components/auth/LoginModal";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { Icon } from "@/components/Icon";
import { Toast } from "@/components/ui/Toast";

export function HeaderActions() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginSuccessToastOpen, setLoginSuccessToastOpen] = useState(false);

  const openLogin = () => {
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  const openSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    setLoginSuccessToastOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="hidden rounded-full px-4 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low lg:block"
        >
          Become a Host
        </button>
        <button
          type="button"
          aria-label="Change language"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
        >
          <Icon name="language" className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openLogin}
            className="cursor-pointer rounded-full px-4 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={openSignUp}
            className="cursor-pointer rounded-full bg-primary px-6 py-2 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95"
          >
            Sign up
          </button>
        </div>
      </div>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignUpClick={openSignUp}
        onSuccess={handleLoginSuccess}
      />
      <SignUpModal
        open={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onLoginClick={openLogin}
      />
      <Toast
        message="You're logged in successfully!"
        open={loginSuccessToastOpen}
        onClose={() => setLoginSuccessToastOpen(false)}
      />
    </>
  );
}
