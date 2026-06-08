import { Outlet } from "react-router-dom";

import { Sidebar } from "../navigation/Sidebar";
import { Header } from "../navigation/Header";

export function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar items={[]} />

      <div className="flex-1">
        <Header
          userName="Admin"
        />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}