import { useState } from "react";
import { Search, Menu, Bell } from "lucide-react";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";

interface HeaderProps {
  userName: string;
  avatar?: string;
  onMenuClick?: () => void;
}

export function Header({ userName, avatar, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-sm lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        
        {/* Search - Desktop */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 min-w-[300px]">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search products, properties..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* Mobile Search Button */}
      <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Search size={20} className="text-gray-600" />
      </button>

      <div className="flex items-center gap-3 lg:gap-4">
        <NotificationDropdown />
        <UserDropdown userName={userName ?? ""} avatar={avatar} />
      </div>
    </header>
  );
}