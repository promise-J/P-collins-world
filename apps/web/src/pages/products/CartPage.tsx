import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { Button, Card, Input, Spinner } from "@/ui";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  X,
  CreditCard,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    items, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    getTotalItems,
    coupon,
    isLoading,
    fetchCart
  } = useCartStore();
  
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // ✅ Modal states
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [itemName, setItemName] = useState<string>("");
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();
  const totalItems = getTotalItems();

  const handleQuantityChange = async (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    await updateQuantity(productId, newQuantity);
  };

  // ✅ Show remove confirmation modal
  const handleRemoveClick = (productId: string, name: string) => {
    setItemToRemove(productId);
    setItemName(name);
    setShowRemoveItemModal(true);
  };

  // ✅ Confirm remove
  const handleConfirmRemove = async () => {
    if (!itemToRemove) return;
    setIsModalLoading(true);
    await removeFromCart(itemToRemove);
    setIsModalLoading(false);
    setShowRemoveItemModal(false);
    setItemToRemove(null);
    setItemName("");
  };

  // ✅ Show clear cart confirmation
  const handleClearCartClick = () => {
    setShowClearCartModal(true);
  };

  // ✅ Confirm clear cart
  const handleConfirmClearCart = async () => {
    setIsModalLoading(true);
    await clearCart();
    setIsModalLoading(false);
    setShowClearCartModal(false);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    
    setIsApplyingCoupon(true);
    // Simulate coupon validation (replace with actual API call)
    setTimeout(() => {
      if (couponCode.toUpperCase() === "SAVE10") {
        applyCoupon("SAVE10", 10, "PERCENTAGE");
      } else if (couponCode.toUpperCase() === "SAVE20") {
        applyCoupon("SAVE20", 20, "PERCENTAGE");
      } else if (couponCode.toUpperCase() === "FIXED500") {
        applyCoupon("FIXED500", 500, "FIXED");
      } else {
        toast.error("Invalid coupon code");
      }
      setIsApplyingCoupon(false);
      setCouponCode("");
    }, 500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCart();
    setIsRefreshing(false);
    toast.success("Cart refreshed");
  };

  if (isLoading && items.length === 0) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">
              Shopping Cart ({totalItems} items)
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh cart"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </button>
          </div>
          <Button 
            onClick={handleClearCartClick} 
            variant="ghost" 
            className="text-red-500 hover:text-red-600"
            disabled={isLoading}
          >
            Clear All
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-4">
            <Spinner size="md" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item._id} className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={item.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <Link to={`/products/${item.productId}`}>
                          <h3 className="font-semibold text-[var(--color-brand-text)] hover:text-[var(--color-brand-primary)] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          ₦{item.price.toLocaleString()} each
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveClick(item._id, item.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        disabled={isLoading}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-between items-center mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                          className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                          className="p-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          disabled={item.quantity >= item.stock || isLoading}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-[var(--color-brand-primary)]">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.stock - 2 && item.stock > 0 && (
                      <p className="text-xs text-orange-500 mt-2">
                        Only {item.stock} items left in stock
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({coupon?.code})</span>
                    <span>-₦{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[var(--color-brand-primary)]">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              {!coupon ? (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apply Coupon
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1"
                      label="Enter coupon code"
                    />
                    <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
                      {isApplyingCoupon ? <Spinner size="sm" /> : "Apply"}
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Try: SAVE10 (10% off), SAVE20 (20% off), FIXED500 (₦500 off)
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-3 bg-green-50 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-green-700">Coupon Applied</span>
                    <p className="text-xs text-green-600">{coupon.code}</p>
                  </div>
                  <button onClick={removeCoupon} className="text-green-700 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Checkout Button */}
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={() => navigate("/checkout")}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>

              <Link to="/products">
                <Button variant="ghost" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* ✅ Clear Cart Confirmation Modal */}
      <ConfirmationModal
        open={showClearCartModal}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        variant="danger"
        loading={isModalLoading}
        onConfirm={handleConfirmClearCart}
        onCancel={() => setShowClearCartModal(false)}
      />

      {/* ✅ Remove Item Confirmation Modal */}
      <ConfirmationModal
        open={showRemoveItemModal}
        title="Remove Item"
        message={`Are you sure you want to remove "${itemName}" from your cart?`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="warning"
        loading={isModalLoading}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setShowRemoveItemModal(false);
          setItemToRemove(null);
          setItemName("");
        }}
      />
    </Container>
  );
}