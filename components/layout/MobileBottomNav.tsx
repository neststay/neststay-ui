"use client";

import { MOBILE_NAV_ITEMS } from "@/lib/constants/navigation";

import { MobileNavItem } from "@/components/navigation/MobileNavItem";

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-outline-variant bg-surface px-6 py-3 md:hidden"
    >
      {MOBILE_NAV_ITEMS.map((item) => (
        <MobileNavItem key={item.href} {...item} />
      ))}
    </nav>
  );
}
