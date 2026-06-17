import { Bell } from "lucide-react";
import { notificationStore } from "../../store/notification.store";
import { useState } from "react";
import { Link } from "react-router-dom";

export function NotificationDropdown() {
  const { unreadCount, notifications } = notificationStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Link to='/notifications'>
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-xs text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-xs text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button> */}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-100 bg-white shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-semibold text-[var(--color-brand-text)]">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications?.slice(0, 5).map((notif: any) => (
                <div key={notif.id} className="p-3 border-b border-gray-50 hover:bg-gray-50">
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}