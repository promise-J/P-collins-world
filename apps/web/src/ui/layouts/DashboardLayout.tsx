import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../navigation/Sidebar";
import { MobileSidebar } from "../navigation/MobileSidebar";
import { MobileBottomNav } from "../navigation/MobileBottomNav";
import { Header } from "../navigation/Header";
import { USER_MENU, ADMIN_MENU } from "../../config/sidebar.config";
import { useAuthStore } from "../../store/auth.store";
import { DashboardFooter } from "./DashboardFooter";

export function DashboardLayout() {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const menuItems = isAdmin ? ADMIN_MENU : USER_MENU;

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