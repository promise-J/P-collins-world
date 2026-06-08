import { Outlet } from "react-router-dom";
import { PublicHeader } from "../navigation/PublicHeader";
import { Footer } from "../navigation/Footer";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}