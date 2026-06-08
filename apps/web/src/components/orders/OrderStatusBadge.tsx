interface OrderStatusBadgeProps {
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

const statusConfig = {
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Paid", className: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Shipped", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}