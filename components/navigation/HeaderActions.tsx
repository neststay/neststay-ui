import Link from "next/link";

import { Icon } from "@/components/Icon";

export function HeaderActions() {
  return (
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
        <Link
          href="/login"
          className="rounded-full px-4 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-primary px-6 py-2 font-label-md text-label-md text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
