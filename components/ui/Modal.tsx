"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/components/Icon";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="hide-scrollbar flex h-full items-center justify-center overflow-y-auto p-margin-mobile">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className={`relative z-10 my-auto w-full ${className}`.trim()}
          onClick={(event) => event.stopPropagation()}
        >
        {title ? (
          <span id={titleId} className="sr-only">
            {title}
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-20 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
          onClick={onClose}
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
        {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
