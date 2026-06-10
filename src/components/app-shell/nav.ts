import {
  LayoutDashboard,
  Image as ImageIcon,
  Receipt,
  Store,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Match only the exact href (don't highlight on nested routes). */
  exact?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Postcards", icon: ImageIcon },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
];

/** Shown separately at the foot of the nav. */
export const STORE_LINK: NavItem = { href: "/", label: "View store", icon: Store };
