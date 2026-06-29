import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";
import { Card, Button, Spinner, Badge, Pagination } from "@/ui";
import { 
  Package, 
  Calendar, 
  CreditCard, 
  Eye,
  Search,
  ChevronDown,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag,
  RefreshCw
} from "lucide-react";
import Container from "@/ui/components/Container";
import { getFirstImageUrl } from "@/utils/imageHelper";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", page, statusFilter],
    queryFn: () => OrderService.getMyOrders({ 
      page, 
      limit: 10,
      status: statusFilter || undefined,
    }),
  });

  const orders = data?.data?.data || data?.data || [];
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
  const total = data?.data?.total || data?.total || 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "PAID":
        return <Badge variant="primary">Paid</Badge>;
      case "SHIPPED":
        return <Badge variant="secondary">Shipped</Badge>;
      case "DELIVERED":
        return <Badge variant="success">Delivered</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Cancelled</Badge>;
      case "FAILED":
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter((order: any) =>
    order._id.toLowerCase().includes(search.toLowerCase()) ||
    order.items?.some((item: any) => 
      item.productId?.name?.toLowerCase().includes(search.toLowerCase())
    )
  );

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
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-3">
              <ShoppingBag size={28} className="text-[var(--color-brand-primary)]" />
              My Orders
            </h1>
            <p className="text-gray-500 mt-1">
              {total} order{total !== 1 ? 's' : ''} placed
            </p>
          </div>
          <Button onClick={() => refetch()} variant="secondary">
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or product..."
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
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-xl font-semibold text-[var(--color-brand-text)] mb-2">
              {search || statusFilter ? "No Matching Orders" : "No Orders Yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {search || statusFilter 
                ? "Try adjusting your search or filters" 
                : "Start shopping to see your orders here"}
            </p>
            <Link to="/products">
              <Button>
                <ShoppingBag size={18} className="mr-2" />
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order: any) => (
              <Card key={order._id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-[var(--color-brand-text)]">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard size={14} />
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        <span>{order.items?.length || 0} items</span>
                      </div>
                    </div>

                    {/* Items Preview - Show ALL items */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items?.map((item: any) => (
                        <div key={item._id} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                          <img
                            src={getFirstImageUrl(item.productId?.images, "https://via.placeholder.com/40")}
                            alt={item.productId?.name || "Product"}
                            className="w-8 h-8 rounded object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/40";
                            }}
                          />
                          <span className="text-xs text-gray-600 line-clamp-1 max-w-[100px]">
                            {item.productId?.name || "Product"}
                          </span>
                          <span className="text-xs text-gray-400">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-[var(--color-brand-primary)]">
                      ₦{order.totalAmount?.toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Link to={`/orders/${order._id}`}>
                        <Button size="sm" variant="secondary">
                          <Eye size={14} className="mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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