"use client";

import type { CategoryItem } from "@/lib/constants/categories";
import { Icon, type IconName } from "@/components/Icon";

type CategoryTabProps = {
  category: CategoryItem;
  active: boolean;
  onSelect: () => void;
};

export function CategoryTab({ category, active, onSelect }: CategoryTabProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group flex min-w-fit flex-col items-center gap-2 border-b-2 pb-2 transition-all ${
        active
          ? "border-on-surface"
          : "border-transparent hover:border-outline-variant"
      }`}
    >
      <Icon
        name={category.icon as IconName}
        className={`h-6 w-6 ${
          active
            ? "text-on-surface"
            : "text-on-surface-variant group-hover:text-on-surface"
        }`}
      />
      <span
        className={`font-label-sm text-label-sm ${
          active
            ? "text-on-surface"
            : "text-on-surface-variant group-hover:text-on-surface"
        }`}
      >
        {category.label}
      </span>
    </button>
  );
}
