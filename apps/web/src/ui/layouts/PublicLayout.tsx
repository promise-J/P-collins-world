import { Outlet } from "react-router-dom";
import { PublicHeader } from "../navigation/PublicHeader";
import { Footer } from "../navigation/Footer";
import { MobileBottomNav } from "../navigation/MobileBottomNav";
import { useAuthStore } from "@/store/auth.store";

export function PublicLayout() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 pb-20 md:pb-8">
        <Outlet />
      </main>
      <Footer />
      {isAuthenticated && <MobileBottomNav />}
    </div>
  );
}