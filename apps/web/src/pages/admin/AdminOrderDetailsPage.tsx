import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminOrderService } from "@/services/admin-order.service";
import { Card, Button, Spinner, Badge, Input, TextArea } from "@/ui";
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
  Edit,
  Save,
  AlertCircle,
  ShoppingBag,
  Send,
  Printer
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";
import { getFirstImageUrl } from "@/utils/imageHelper";

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "FAILED", label: "Failed" },
];

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => AdminOrderService.getOrderDetails(id!),
    enabled: !!id,
  });

  const order = data?.data || data;

  const updateStatusMutation = useMutation({
    mutationFn: () => AdminOrderService.updateOrderStatus(id!, selectedStatus, statusNote),
    onSuccess: () => {
      toast.success("Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setIsEditingStatus(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update order status");
    },
  });

  const updateTrackingMutation = useMutation({
    mutationFn: () => AdminOrderService.updateTrackingNumber(id!, trackingNumber),
    onSuccess: () => {
      toast.success("Tracking number updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      setIsUpdatingTracking(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update tracking number");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: () => AdminOrderService.addAdminNote(id!, adminNote),
    onSuccess: () => {
      toast.success("Admin note added");
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
      setAdminNote("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add admin note");
    },
  });

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
        <Icon size={14} />
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

  if (!order) {
    return (
      <Container>
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-semibold text-brand-text mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/admin/orders"><Button>Back to Orders</Button></Link>
        </div>
      </Container>
    );
  }

  const handleStatusUpdate = () => {
    setConfirmAction(() => () => {
      updateStatusMutation.mutate();
    });
    setShowConfirmModal(true);
  };

  const handleTrackingUpdate = () => {
    setConfirmAction(() => () => {
      updateTrackingMutation.mutate();
    });
    setShowConfirmModal(true);
  };

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <button
              onClick={() => navigate("/admin/orders")}
              className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors mb-2"
            >
              <ArrowLeft size={20} />
              Back to Orders
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-brand-text">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              {getStatusBadge(order.status)}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </Button>
            <Button variant="secondary">
              <Printer size={18} className="mr-2" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-brand-text flex items-center gap-2">
                  <Package size={20} className="text-brand-primary" />
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
                      onError={(e) => e.currentTarget.src = "https://via.placeholder.com/80"}
                    />
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.productId?._id}`}>
                        <h3 className="font-medium text-brand-text hover:text-brand-primary transition-colors">
                          {item.productId?.name || "Product"}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">
                        ₦{item.price?.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-brand-primary">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-primary">₦{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Admin Notes */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-brand mb-4 flex items-center gap-2">
                <Edit size={20} className="text-brand-primary" />
                Admin Notes
              </h2>
              {order.adminNotes && (
                <div className="p-3 bg-yellow-50 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800">{order.adminNotes}</p>
                </div>
              )}
              <div className="flex gap-2">
                <TextArea
                  label="Add Note"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add internal note about this order..."
                  rows={2}
                  className="flex-1"
                />
                <Button 
                  onClick={() => addNoteMutation.mutate()} 
                  disabled={!adminNote.trim() || addNoteMutation.isPending}
                  className="mt-6"
                >
                  <Send size={16} className="mr-2" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Update */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-brand-text)] mb-4 flex items-center gap-2">
                <Edit size={20} className="text-brand-primary" />
                Update Status
              </h2>
              {!isEditingStatus ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <p className="font-medium">{getStatusBadge(order.status)}</p>
                  </div>
                  <Button onClick={() => setIsEditingStatus(true)} variant="secondary" size="sm">
                    <Edit size={14} className="mr-1" />
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    value={selectedStatus || order.status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <TextArea
                    label="Note (Optional)"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Reason for status change..."
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => setIsEditingStatus(false)} variant="ghost" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleStatusUpdate} disabled={updateStatusMutation.isPending} className="flex-1">
                      Update
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Tracking */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-brand-text mb-4 flex items-center gap-2">
                <Truck size={20} className="text-brand-primary" />
                Tracking
              </h2>
              {order.trackingNumber ? (
                <div className="mb-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Tracking #: <strong>{order.trackingNumber}</strong></p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">No tracking number assigned</p>
              )}
              {!isUpdatingTracking ? (
                <Button onClick={() => setIsUpdatingTracking(true)} variant="secondary" className="w-full flex justify-center items-center gap-2" size="sm">
                  <Edit size={14} className="mr-1" />
                  {order.trackingNumber ? "Update Tracking" : "Add Tracking"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    label="Tracking Number"
                    value={trackingNumber || order.trackingNumber || ""}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => setIsUpdatingTracking(false)} variant="ghost" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleTrackingUpdate} disabled={updateTrackingMutation.isPending} className="flex-1">
                      <Save size={16} className="mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Customer Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-brand-text mb-4 flex items-center gap-2">
                <User size={20} className="text-brand-primary" />
                Customer
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">
                  {order.userId?.firstName} {order.userId?.lastName}
                </p>
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail size={14} />
                  <span>{order.userId?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone size={14} />
                  <span>{order.userId?.phone || "N/A"}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-brand-text mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-brand-primary" />
                  Shipping Address
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.lga}</p>
                  <p>{order.shippingAddress.state}, {order.shippingAddress.country}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={14} />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-brand-text mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Reference</span>
                  <span className="font-mono text-xs">{order.paymentReference || "N/A"}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span>₦{order.deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-brand-primary">₦{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmModal}
        title="Confirm Action"
        message="Are you sure you want to perform this action?"
        confirmText="Confirm"
        variant="warning"
        loading={updateStatusMutation.isPending || updateTrackingMutation.isPending}
        onConfirm={() => {
          confirmAction();
          setShowConfirmModal(false);
        }}
        onCancel={() => setShowConfirmModal(false)}
      />
    </Container>
  );
}