"use client";

import { NAV_ITEMS } from "@/lib/constants/navigation";

import { NavLink } from "@/components/navigation/NavLink";

export function Navigation() {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </nav>
  );
}
