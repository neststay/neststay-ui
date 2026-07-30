"use client";

import { useState } from "react";

import {
  CATEGORY_ITEMS,
  type CategoryItem,
} from "@/lib/constants/categories";
import { PageContainer } from "@/components/layout/PageContainer";
import { CategoryTab } from "@/components/navigation/CategoryTab";

type CategoryFilterBarProps = {
  defaultSelectedId?: string;
  onCategorySelect?: (category: CategoryItem) => void;
};

export function CategoryFilterBar({
  defaultSelectedId = CATEGORY_ITEMS[0]?.id,
  onCategorySelect,
}: CategoryFilterBarProps) {
  const [selectedId, setSelectedId] = useState(defaultSelectedId);

  const handleSelect = (category: CategoryItem) => {
    setSelectedId(category.id);
    onCategorySelect?.(category);
  };

  return (
    <div className="sticky top-[72px] z-40 border-b border-outline-variant bg-surface">
      <PageContainer className="flex items-center gap-10 overflow-x-auto py-4 hide-scrollbar">
        {CATEGORY_ITEMS.map((category) => (
          <CategoryTab
            key={category.id}
            category={category}
            active={selectedId === category.id}
            onSelect={() => handleSelect(category)}
          />
        ))}
      </PageContainer>
    </div>
  );
}
