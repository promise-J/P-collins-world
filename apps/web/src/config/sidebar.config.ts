import {
  Home,
  Building2,
  Wallet,
  ShoppingBag,
  Bell,
  User,
  Settings,
  Shield,
  BarChart3,
  Package,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  CreditCard,
  Plus,
  Heart,
  AlertTriangle,
  ToolboxIcon,
  Layers,
  MapPin,
} from "lucide-react";


// Common menu items for all users
const commonMenuItems = [
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Settings", icon: Settings, path: "/settings" },
];


export const USER_MENU = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    label: "Wallet",
    icon: Wallet,
    path: "/wallet",
  },
  {
    label: "Fund Wallet",
    icon: Wallet,
    path: "/wallet/fund",
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
    label: "Group Savings",
    icon: Users,
    path: "/savings/groups",
  },
  {
    label: "Marketplace",
    icon: ShoppingBag,
    path: "/products",
  },
  {
    label: "KYC Verification",
    icon: FileText,
    path: "/kyc/submit",
  },
  { label: "My Orders", icon: Package, path: "/orders" },
  { label: "Wishlist", icon: Heart, path: "/wishlist" },
  ...commonMenuItems
];



// Real Estate Agent Menu
export const AGENT_MENU = [
  { label: "Dashboard", icon: Home, path: "/agent/dashboard" },
  {label: "Wallet",icon: Wallet,path: "/wallet",},
  { label: "Properties", icon: Building2, path: "/agent/properties" },
  { label: "Add Property", icon: Plus, path: "/agent/properties/add" },
  { label: "Inquiries", icon: MessageSquare, path: "/agent/inquiries" },
  { label: "Appointments", icon: Calendar, path: "/agent/appointments" },
  { label: "Clients", icon: Users, path: "/agent/clients" },
  { label: "Analytics", icon: BarChart3, path: "/agent/analytics" },
  { label: "Commission", icon: Wallet, path: "/agent/commission" },
  ...commonMenuItems,
];

// Landlord Menu
export const LANDLORD_MENU = [
  { label: "Dashboard", icon: Home, path: "/landlord/dashboard" },
  {label: "Wallet",icon: Wallet,path: "/wallet",},
  { label: "My Properties", icon: Building2, path: "/landlord/properties" },
  { label: "Add Property", icon: Plus, path: "/landlord/properties/add" },
  { label: "Tenants", icon: Users, path: "/landlord/tenants" },
  { label: "Rent Payments", icon: CreditCard, path: "/landlord/rentals" },
  { label: "Maintenance", icon: ToolboxIcon, path: "/landlord/maintenance" },
  { label: "Documents", icon: FileText, path: "/landlord/documents" },
  { label: "Analytics", icon: BarChart3, path: "/landlord/analytics" },
  ...commonMenuItems,
];

// Admin Menu
export const ADMIN_MENU = [
  { label: "Dashboard", icon: Shield, path: "/admin/dashboard" },
  { label: "Transactions", icon: CreditCard, path: "/admin/transactions" },
  {label: "Orders",icon: Package,path: "/admin/orders",},
  { label: "Properties", icon: Building2, path: "/admin/properties" },
  { label: "Products", icon: ShoppingBag, path: "/admin/products" },
  {label: "Categories",icon: Layers,path: "/admin/categories",},
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "KYC Reviews", icon: Shield, path: "/admin/kyc" },
  { label: "Disputes", icon: AlertTriangle, path: "/admin/disputes" },
  {label: "Delivery Locations", icon: MapPin, path: "/admin/locations",},
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Audit Logs", icon: FileText, path: "/admin/audit" },
  ...commonMenuItems,
];