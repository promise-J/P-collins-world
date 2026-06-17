import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../navigation/Sidebar";
import { MobileSidebar } from "../navigation/MobileSidebar";
import { MobileBottomNav } from "../navigation/MobileBottomNav";
import { Header } from "../navigation/Header";
import { 
  USER_MENU, 
  AGENT_MENU, 
  LANDLORD_MENU, 
  ADMIN_MENU 
} from "../../config/sidebar.config";
import { useAuthStore } from "../../store/auth.store";
import { DashboardFooter } from "./DashboardFooter";

export function DashboardLayout() {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get role-based menu items
  const getMenuItems = () => {
    switch (user?.role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return ADMIN_MENU;
      case "AGENT":
        return AGENT_MENU;
      case "LANDLORD":
        return LANDLORD_MENU;
      default:
        return USER_MENU;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={menuItems} />
      
      <MobileSidebar 
        open={isMobileMenuOpen} 
        items={menuItems} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          userName={`${user?.firstName || ""} ${user?.lastName || ""}`} 
          avatar={user?.avatar}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-auto pb-20 md:pb-6">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
        
        <DashboardFooter />
        <MobileBottomNav />
      </div>
    </div>
  );
}