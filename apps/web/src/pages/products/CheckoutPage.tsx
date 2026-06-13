import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button, Card, Input, Spinner } from "@/ui";
import { 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  Wallet,
  Building2,
  User
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { isProductPopulated } from "@/utils/helpers";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("card");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
    country: profile?.country || "Nigeria",
  });

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city || !formData.state) {
      toast.error("Please fill in all shipping details");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/orders");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-[var(--color-brand-text)] mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-[var(--color-brand-primary)]" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="md:col-span-2"
                  required
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </Card>

            {/* Payment Method */}
            <Card>
              <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-[var(--color-brand-primary)]" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-[var(--color-brand-primary)]" />
                    <div>
                      <p className="font-medium">Card Payment</p>
                      <p className="text-sm text-gray-500">Pay with debit/credit card</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-5 h-5 text-[var(--color-brand-primary)]"
                  />
                </label>
                
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Wallet size={20} className="text-[var(--color-brand-primary)]" />
                    <div>
                      <p className="font-medium">Wallet Balance</p>
                      <p className="text-sm text-gray-500">Pay using your P Collins wallet</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                    className="w-5 h-5 text-[var(--color-brand-primary)]"
                  />
                </label>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    {
                      isProductPopulated(item.productId) && 
                    <img
                      src={item.productId.images?.[0] || "https://via.placeholder.com/60x60"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    }
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[var(--color-brand-primary)]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? <Spinner size="sm" /> : (
                  <>
                    <CreditCard size={18} className="mr-2" />
                    Place Order
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}