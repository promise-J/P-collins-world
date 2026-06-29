import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService, Notification, groupNotificationsByDate } from "@/services/notification.service";
import { Button, Spinner } from "@/ui";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Circle,
  CheckCircle,
  Info,
  AlertCircle,
  AlertTriangle,
  X,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { Link } from "react-router-dom";

const PAGE_SIZE = 20;

export default function NotificationPage() {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastNotificationRef = useRef<HTMLDivElement | null>(null);

  // Fetch notifications with infinite scroll
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => NotificationService.getNotifications({ page, limit: PAGE_SIZE }),
    enabled: true,
  });

  // Get unread count
  const { data: unreadData, refetch: refetchUnread } = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: () => NotificationService.getUnreadCount(),
    enabled: true,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
      refetchUnread();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark notification as read");
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
      refetchUnread();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to mark all as read");
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => NotificationService.deleteNotification(id),
    onSuccess: () => {
      toast.success("Notification deleted");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
      refetchUnread();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete notification");
    },
  });

  // ✅ Update notifications when data changes - handle nested data structure
  useEffect(() => {
    if (data) {
      // Handle different data structures
      let notificationList: Notification[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        notificationList = data.data;
      } else if (data.data?.data && Array.isArray(data.data.data)) {
        notificationList = data.data.data;
      } else if (Array.isArray(data)) {
        notificationList = data;
      }
      
      if (page === 1) {
        setNotifications(notificationList);
      } else {
        setNotifications(prev => [...prev, ...notificationList]);
      }
      
      const totalPages = data.totalPages || data.data?.totalPages || 1;
      setHasMore(page < totalPages);
    }
  }, [data, page]);

  // Infinite scroll setup
  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    
    if (lastNotificationRef.current) {
      observerRef.current.observe(lastNotificationRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, isLoadingMore, hasMore, notifications]);

  // Reset loading more when page changes
  useEffect(() => {
    if (isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [data]);

  const handleMarkAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync(id);
  };

  const handleDelete = async (id: string) => {
    await deleteNotificationMutation.mutateAsync(id);
  };

  const handleMarkAllAsRead = async () => {
    const unreadCount = unreadData?.data?.count || 0;
    if (unreadCount === 0) {
      toast.error("No unread notifications");
      return;
    }
    await markAllAsReadMutation.mutateAsync();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    await refetchUnread();
    setIsRefreshing(false);
    toast.success("Notifications refreshed");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle size={18} className="text-green-500" />;
      case "WARNING":
        return <AlertTriangle size={18} className="text-yellow-500" />;
      case "ERROR":
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string, isRead: boolean) => {
    if (isRead) return "bg-white hover:bg-gray-50";
    switch (type) {
      case "SUCCESS":
        return "bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500";
      case "WARNING":
        return "bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-500";
      case "ERROR":
        return "bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500";
      default:
        return "bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500";
    }
  };

  // ✅ Use the fixed groupNotificationsByDate function with proper data
  const groupedNotifications = groupNotificationsByDate(notifications);
  const unreadCount = unreadData?.data?.count || 0;

  // Handle loading state
  if (isLoading && page === 1) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
              <Bell size={28} className="text-[var(--color-brand-primary)]" />
              Notifications
            </h1>
            <p className="text-gray-500 mt-1">
              Stay updated with your latest activities
            </p>
            {unreadCount > 0 && (
              <p className="text-sm text-[var(--color-brand-primary)] mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <Button 
                onClick={handleMarkAllAsRead} 
                variant="secondary" 
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCheck size={18} className="mr-2" />
                Mark all as read ({unreadCount})
              </Button>
            )}
            <Button 
              onClick={handleRefresh} 
              variant="ghost"
              disabled={isRefreshing}
            >
              <RefreshCw size={18} className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-brand-text)] mb-2">
              No Notifications
            </h3>
            <p className="text-gray-500">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedNotifications).map(([date, groupNotifications]) => (
              <div key={date}>
                <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-3 pb-2 border-b border-gray-100">
                  {date}
                </h2>
                <div className="space-y-3">
                  {groupNotifications.map((notification, index) => {
                    const isLast = index === groupNotifications.length - 1 && 
                                  date === Object.keys(groupedNotifications)[Object.keys(groupedNotifications).length - 1];
                    
                    return (
                      <motion.div
                        key={notification._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        ref={isLast ? lastNotificationRef : null}
                        className={`rounded-xl p-4 transition-all duration-200 cursor-pointer ${getNotificationBg(notification.type, notification.isRead)}`}
                        onClick={() => {
                          if (!notification.isRead) {
                            handleMarkAsRead(notification._id);
                          }
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl;
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <h3 className={`font-semibold ${!notification.isRead ? "text-[var(--color-brand-text)]" : "text-gray-700"}`}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">
                                  {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(notification._id);
                                  }}
                                  className="p-1 rounded-lg hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            {notification.actionUrl && (
                              <div className="mt-2">
                                <span className="text-xs text-[var(--color-brand-primary)] hover:underline">
                                  Click to view →
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Unread indicator */}
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Mark as read"
                            >
                              <Circle size={12} className="text-[var(--color-brand-primary)] fill-[var(--color-brand-primary)]" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <Spinner size="md" />
              </div>
            )}
            
            {/* End of notifications */}
            {!hasMore && notifications.length > 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">You've seen all notifications</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
}