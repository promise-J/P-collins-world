import {
  Home,
  Building2,
  Wallet,
  ShoppingBag,
  Bell,
  User,
  Settings,
  Shield,
} from "lucide-react";

export const USER_MENU = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },

  {
    label: "Properties",
    icon: Building2,
    path: "/properties",
  },

  {
    label: "Savings",
    icon: Wallet,
    path: "/savings",
  },

  {
    label: "Marketplace",
    icon: ShoppingBag,
    path: "/marketplace",
  },

  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
  },

  {
    label: "Profile",
    icon: User,
    path: "/profile",
  },

  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const ADMIN_MENU = [
  ...USER_MENU,

  {
    label: "Admin",
    icon: Shield,
    path: "/admin",
  },
];
