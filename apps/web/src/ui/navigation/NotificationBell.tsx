import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { NotificationService } from "@/services/notification.service";

interface NotificationBellProps {
  size?: number;
}

export function NotificationBell({ size = 20 }: NotificationBellProps) {
  const { data } = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () => NotificationService.getUnreadCount(),
    refetchInterval: 30000,
  });

  const unreadCount = data?.data?.count || 0;

  return (
    <Link to="/notifications" className="relative">
      <Bell size={size} className="text-gray-600 hover:text-brand-primary transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}