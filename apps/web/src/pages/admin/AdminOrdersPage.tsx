import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AdminOrderService } from "@/services/admin-order.service";
import { Card, Button, Spinner, Badge, Pagination } from "@/ui";
import { 
  Package, 
  Search, 
  Eye, 
  RefreshCw,
  Filter,
  ChevronDown,
  Calendar,
  User,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";
import Container from "@/ui/components/Container";
import { getFirstImageUrl } from "@/utils/imageHelper";

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-orders", page, statusFilter, search, sortBy, sortOrder],
    queryFn: () => AdminOrderService.getAllOrders({
      page,
      limit: 20,
      status: statusFilter || undefined,
      search: search || undefined,
      sortBy,
      sortOrder,
    }),
  });

  const orders = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const total = data?.data?.total || data?.total || 0;
  const stats = data?.stats || {};

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: { variant: "warning", icon: Clock },
      PAID: { variant: "primary", icon: CreditCard },
      SHIPPED: { variant: "info", icon: Truck },
      DELIVERED: { variant: "success", icon: CheckCircle },
      CANCELLED: { variant: "danger", icon: XCircle },
      FAILED: { variant: "danger", icon: AlertCircle },
    };
    const config = variants[status] || { variant: "default", icon: Package };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon size={12} />
        {status}
      </Badge>
    );
  };

  if (isLoading) {
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
            <h1 className="text-2xl font-bold text-[var(--color-brand-text)] flex items-center gap-3">
              <Package size={28} className="text-[var(--color-brand-primary)]" />
              Order Management
            </h1>
            <p className="text-gray-500 mt-1">
              {total} total orders • {stats.byStatus?.length || 0} statuses
            </p>
          </div>
          <Button onClick={() => refetch()} variant="secondary">
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <Card className="p-3 text-center">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-xl font-bold text-[var(--color-brand-text)]">{total}</p>
          </Card>
          {stats.byStatus?.map((stat: any) => (
            <Card key={stat._id} className="p-3 text-center">
              <p className="text-xs text-gray-500">{stat._id}</p>
              <p className="text-xl font-bold text-[var(--color-brand-text)]">{stat.count}</p>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] appearance-none pr-10"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="FAILED">Failed</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] appearance-none pr-10"
            >
              <option value="createdAt">Date</option>
              <option value="totalAmount">Amount</option>
              <option value="status">Status</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-600">No Orders Found</h3>
            <p className="text-gray-400 mt-1">
              {search || statusFilter ? "Try adjusting your search or filters" : "No orders in the system yet"}
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{order.userId?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {order.items?.slice(0, 3).map((item: any) => (
                            <img
                              key={item._id}
                              src={getFirstImageUrl(item.productId?.images, "https://via.placeholder.com/30")}
                              alt={item.productId?.name}
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/30";
                              }}
                            />
                          ))}
                          {order.items?.length > 3 && (
                            <span className="text-xs text-gray-400">+{order.items.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ₦{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {order.paymentMethod}
                        {order.paymentReference && (
                          <p className="text-xs text-gray-400 font-mono">{order.paymentReference.slice(0, 12)}...</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/orders/${order._id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </Container>
  );
}