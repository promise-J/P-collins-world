import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderService } from "@/services/order.service";
import { Card, Button, Spinner, Badge } from "@/ui";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  User,
  Phone,
  Mail,
  Home,
  ShoppingBag,
  MessageSquare,
  AlertCircle,
  Copy,
  ExternalLink,
  Package2
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";
import { getFirstImageUrl } from "@/utils/imageHelper";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderService.getOrderDetails(id!),
    enabled: !!id,
  });

  const order = data?.data || data;

  const cancelMutation = useMutation({
    mutationFn: () => OrderService.cancelOrder(id!),
    onSuccess: (response) => {
      const refundMessage = response.data?.refundMessage || "";
      toast.success(`Order cancelled successfully. ${refundMessage}`);
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setShowCancelModal(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

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

  const canCancel = order?.status === "PENDING" || order?.status === "PAID";

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </button>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              {getStatusBadge(order.status)}
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard size={14} />
                <span>Payment: {order.paymentMethod}</span>
              </div>
              {order.paymentReference && (
                <div className="flex items-center gap-1">
                  <CreditCard size={14} />
                  <span className="font-mono">Ref: {order.paymentReference}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </Button>
            {canCancel && (
              <Button onClick={() => setShowCancelModal(true)} variant="danger">
                <XCircle size={18} className="mr-2" />
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[var(--color-brand-text)] flex items-center gap-2">
                  <Package size={20} className="text-[var(--color-brand-primary)]" />
                  Order Items ({order.items?.length || 0})
                </h2>
              </div>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item._id} className="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img
                      src={getFirstImageUrl(item.productId?.images, "https://via.placeholder.com/80")}
                      alt={item.productId?.name || "Product"}
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/80";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.productId?._id}`}>
                        <h3 className="font-medium text-[var(--color-brand-text)] hover:text-[var(--color-brand-primary)] transition-colors">
                          {item.productId?.name || "Product"}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">
                        ₦{item.price?.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-[var(--color-brand-primary)]">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[var(--color-brand-primary)]">
                    ₦{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Order Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
                <Clock size={20} className="text-[var(--color-brand-primary)]" />
                Order Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED" ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CreditCard size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Payment Confirmed</p>
                      <p className="text-sm text-gray-500">
                        {order.paidAt ? new Date(order.paidAt).toLocaleString() : "Payment processed"}
                      </p>
                    </div>
                  </div>
                ) : null}
                {order.status === "SHIPPED" || order.status === "DELIVERED" ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Truck size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order Shipped</p>
                      <p className="text-sm text-gray-500">
                        {order.shippedAt ? new Date(order.shippedAt).toLocaleString() : "Order on the way"}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tracking: <span className="font-mono">{order.trackingNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
                {order.status === "DELIVERED" ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Home size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-500">
                        {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : "Order delivered"}
                      </p>
                    </div>
                  </div>
                ) : null}
                {order.status === "CANCELLED" ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <XCircle size={16} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order Cancelled</p>
                      <p className="text-sm text-gray-500">
                        {order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : "Order cancelled"}
                      </p>
                      {order.cancellationReason && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {order.cancellationReason}
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>

            {/* ✅ Tracking Number Section */}
            {order.trackingNumber && (
              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-full flex-shrink-0">
                    <Truck size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--color-brand-text)] text-sm">
                        Tracking Information
                      </h3>
                      <Badge variant="secondary" className="text-xs">Shipped</Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      Tracking Number: <strong className="font-mono text-[var(--color-brand-primary)]">{order.trackingNumber}</strong>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(order.trackingNumber);
                          toast.success("Tracking number copied!");
                        }}
                        className="text-xs text-[var(--color-brand-primary)] hover:underline flex items-center gap-1"
                      >
                        <Copy size={12} />
                        Copy Tracking Number
                      </button>
                      <span className="text-xs text-gray-300">|</span>
                      <a 
                        href={`https://www.tracking-site.com/track/${order.trackingNumber}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--color-brand-primary)] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        Track Package
                      </a>
                    </div>
                    {order.shippedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Shipped on: {new Date(order.shippedAt).toLocaleString()}
                      </p>
                    )}
                    {order.estimatedDays && (
                      <p className="text-xs text-gray-400 mt-1">
                        Estimated Delivery: {order.estimatedDays} business days
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Admin Notes Section */}
            {order.adminNotes && (
              <Card className="p-6 border-l-4 border-l-yellow-500">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-50 rounded-full flex-shrink-0">
                    <MessageSquare size={18} className="text-yellow-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--color-brand-text)] text-sm">
                        Admin Note
                      </h3>
                      <Badge variant="warning" className="text-xs">Staff Update</Badge>
                    </div>
                    <p className="text-sm text-gray-700">{order.adminNotes}</p>
                    {order.updatedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Updated: {new Date(order.updatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Refund Status */}
            {order.refundStatus && (
              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-full flex-shrink-0">
                    <AlertCircle size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-brand-text)] text-sm">
                      Refund Status
                    </h3>
                    <p className="text-sm text-gray-700">
                      Status: <strong>{order.refundStatus}</strong>
                    </p>
                    {order.refundReference && (
                      <p className="text-xs text-gray-500 mt-1">
                        Ref: {order.refundReference}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{order.totalAmount?.toLocaleString()}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>₦{order.deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-[var(--color-brand-primary)]">
                    ₦{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tracking Info in Summary */}
              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-green-600" />
                    <p className="text-sm text-green-700">
                      Tracking #: <strong className="font-mono">{order.trackingNumber}</strong>
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(order.trackingNumber);
                      toast.success("Tracking number copied!");
                    }}
                    className="text-xs text-green-600 hover:underline mt-1 flex items-center gap-1"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
              )}
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-[var(--color-brand-primary)]" />
                  Shipping Address
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <User size={14} />
                    <span>{order.shippingAddress.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={14} />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-500 mt-2">
                    <MapPin size={14} className="mt-0.5" />
                    <span>
                      {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.lga}
                      <br />
                      {order.shippingAddress.state}, {order.shippingAddress.country}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        open={showCancelModal}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel Order"
        variant="danger"
        loading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate()}
        onCancel={() => setShowCancelModal(false)}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for cancellation (Optional)
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Why are you cancelling this order?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
            rows={2}
          />
        </div>
      </ConfirmationModal>
    </Container>
  );
}