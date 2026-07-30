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
      <button
        type="button"
        aria-label="Open menu"
        className="flex cursor-pointer items-center gap-2 rounded-full border border-outline-variant px-3 py-1.5 transition-shadow hover:shadow-md"
      >
        <Icon name="menu" className="h-5 w-5 text-on-surface-variant" />
        <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-on-surface-variant text-white">
          <Icon name="account_circle" className="h-5 w-5" filled />
        </span>
      </button>
    </div>
  );
}
