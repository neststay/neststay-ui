import Link from "next/link";

import { FOOTER_LINKS } from "@/lib/constants/navigation";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/navigation/Logo";

export function Footer() {
  return (
    <footer className="mt-xl w-full bg-surface-container-low px-margin-mobile py-xl md:px-margin-desktop">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-between gap-md md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Logo variant="text" />
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-80">
            © 2024 Nest Stay, Inc.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            className="group flex cursor-pointer items-center gap-2"
          >
            <Icon
              name="public"
              className="h-5 w-5 transition-colors group-hover:text-primary"
            />
            <span className="font-label-sm text-label-sm font-semibold">
              English (US)
            </span>
          </button>
          <button type="button" className="cursor-pointer">
            <span className="font-label-sm text-label-sm font-semibold">
              $ USD
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
