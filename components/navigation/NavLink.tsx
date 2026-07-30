"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  label: string;
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  if (active) {
    return (
      <Link
        href={href}
        className="border-b-2 border-primary pb-1 font-body-md text-body-md font-bold text-on-surface"
        aria-current="page"
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-lg px-2 py-1 font-body-md text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-low"
    >
      {label}
    </Link>
  );
}
