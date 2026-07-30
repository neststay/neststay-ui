export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Explore", href: "/" },
  { label: "Experiences", href: "/experiences" },
  { label: "Online Experiences", href: "/online-experiences" },
];

export type MobileNavItem = {
  label: string;
  href: string;
  icon:
    | "explore"
    | "favorite"
    | "luggage"
    | "chat"
    | "account_circle";
};

export const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: "Explore", href: "/", icon: "explore" },
  { label: "Wishlists", href: "/wishlists", icon: "favorite" },
  { label: "Trips", href: "/trips", icon: "luggage" },
  { label: "Inbox", href: "/inbox", icon: "chat" },
  { label: "Profile", href: "/profile", icon: "account_circle" },
];

export type FooterLink = {
  label: string;
  href: string;
};

export const FOOTER_LINKS: FooterLink[] = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Sitemap", href: "#" },
  { label: "Company Details", href: "#" },
  { label: "Destinations", href: "#" },
];
