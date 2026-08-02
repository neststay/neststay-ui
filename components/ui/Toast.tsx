"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/components/Icon";

type ToastProps = {
  message: string;
  open: boolean;
  onClose: () => void;
  duration?: number;
};

export function Toast({
  message,
  open,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, onClose, duration]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 z-[110] w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 md:bottom-8"
    >
      <div className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 shadow-[0_8px_32px_rgba(40,23,24,0.12)]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tertiary-container/15">
          <Icon name="check_circle" className="h-5 w-5 text-tertiary-container" />
        </span>
        <p className="flex-1 font-body-md text-body-md text-on-surface">{message}</p>
        <button
          type="button"
          aria-label="Dismiss notification"
          className="cursor-pointer rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
          onClick={onClose}
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body,
  );
}
