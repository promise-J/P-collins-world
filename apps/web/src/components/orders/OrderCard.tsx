import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Package, Calendar, CreditCard } from 'lucide-react';
import { Card, Badge, Button } from '@/ui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

interface OrderCardProps {
  order: {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    paymentReference: string;
    createdAt: string;
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      {/* Order Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Order #{order._id.slice(-8)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-[var(--color-brand-primary)]">
              ₦{order.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Items</p>
            <p className="font-semibold">{order.items.length} product(s)</p>
          </div>
        </div>

        {/* View Order Button */}
        <Link to={`/orders/${order._id}`}>
          <Button variant="ghost" className="w-full mt-4">
            View Order Details
          </Button>
        </Link>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <h4 className="font-semibold mb-3">Order Items</h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <img
                  src={item.productId.images?.[0] || '/placeholder.png'}
                  alt={item.productId.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.productId.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × ₦{item.price.toLocaleString()}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  ₦{(item.quantity * item.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Order Timeline - Fixed: Pass the status prop correctly */}
          <div className="mt-4">
            <OrderTimeline status={order.status} />
          </div>

          {/* Payment Reference */}
          {order.paymentReference && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CreditCard size={12} />
                <span>Payment Ref: {order.paymentReference}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}