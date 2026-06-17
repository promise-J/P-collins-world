import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { Avatar } from "@/ui";

interface UserDropdownProps {
  userName?: string;
  avatar?: string;
}

export function UserDropdown({ userName, avatar }: UserDropdownProps) {
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Avatar src={avatar} name={userName} />
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {userName}
        </span>
        <ChevronDown size={16} className="hidden md:block text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-100 bg-white shadow-lg z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <p className="font-medium text-brand-text">
                {userName}
              </p>
            </div>

            <Link
              to="/profile"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={18} />
              Profile
            </Link>

            <Link
              to="/settings"
              className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={18} />
              Settings
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}