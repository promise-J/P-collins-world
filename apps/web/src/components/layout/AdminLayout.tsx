import { ADMIN_MENU } from "@/config/sidebar.config";
import { useAuthStore } from "@/store/auth.store";
import { Header, Sidebar } from "@/ui";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
    const user = useAuthStore((state) => state.user);

  // Fallback name if the user state hasn't loaded yet
  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";

  return (
    <div
      className="
       flex
       min-h-screen
      "
    >
      <Sidebar items={ADMIN_MENU} />

      <div
        className="
        flex-1
        bg-slate-50
       "
      >
        <Header userName={displayName} />

        <main
          className="
         p-6
        "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
