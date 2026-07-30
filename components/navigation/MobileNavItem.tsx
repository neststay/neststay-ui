"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { MobileNavItem } from "@/lib/constants/navigation";
import { Icon } from "@/components/Icon";

type MobileNavItemProps = MobileNavItem;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavItem({ href, label, icon }: MobileNavItemProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 ${
        active ? "text-primary" : "text-on-surface-variant"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon name={icon} className="h-6 w-6" filled={active} />
      <span
        className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}
      >
        {label}
      </span>
    </Link>
  );
}
