import { Search } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { UserDropdown } from "./UserDropdown";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-sm w-64"
        />
      </div>

      <div className="flex items-center gap-6">
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </header>
  );
}