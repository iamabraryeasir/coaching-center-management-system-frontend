export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string;
  description?: string;
}

export const PUBLIC_NAV_ITEMS: readonly NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Programs",
    href: "/#programs",
  },
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "About",
    href: "/#about",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
] as const;
