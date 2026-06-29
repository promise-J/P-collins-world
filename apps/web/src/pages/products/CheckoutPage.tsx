import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button, Card, Input, Spinner } from "@/ui";
import { 
  MapPin, 
  CreditCard, 
  Wallet,
  ChevronDown,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { OrderService } from "@/services/order.service";
import { PaystackService } from "@/services/paystack.service";
import { LocationService, Location } from "@/services/location.service";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("card");
  const [availableStates, setAvailableStates] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [locationError, setLocationError] = useState<string>("");
  const [availableLGAs, setAvailableLGAs] = useState<string[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState(3);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
    lga: "",
    country: "Nigeria",
  });

  // Fetch active locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await LocationService.getActiveLocations();
        if (response.success) {
          setAvailableStates(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        toast.error("Failed to load delivery locations");
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    const selectedLocation = availableStates.find(loc => loc.state === state);
    
    if (!selectedLocation) {
      setLocationError("Please select a valid state");
      setFormData({ ...formData, state, lga: "" });
      setAvailableLGAs([]);
      setDeliveryFee(0);
      setEstimatedDays(3);
      return;
    }

    if (!selectedLocation.isActive) {
      setLocationError("This state is currently not available for delivery");
      setFormData({ ...formData, state, lga: "" });
      setAvailableLGAs([]);
      setDeliveryFee(0);
      setEstimatedDays(3);
      return;
    }

    setLocationError("");
    setFormData({ ...formData, state, lga: "" });
    
    // Get active LGAs for this state
    const activeLGAs = selectedLocation.lgas
      .filter(lga => lga.isActive)
      .map(lga => lga.name);
    
    setAvailableLGAs(activeLGAs);
    setDeliveryFee(selectedLocation.deliveryFee || 0);
    setEstimatedDays(selectedLocation.estimatedDays || 3);
  };

  const handleLGAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lga = e.target.value;
    const selectedState = availableStates.find(loc => loc.state === formData.state);
    const selectedLGA = selectedState?.lgas.find(l => l.name === lga);
    
    setFormData({ ...formData, lga });
    
    if (selectedLGA) {
      setDeliveryFee(selectedLGA.deliveryFee !== undefined ? selectedLGA.deliveryFee : selectedState?.deliveryFee || 0);
      setEstimatedDays(selectedLGA.estimatedDays || selectedState?.estimatedDays || 3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!formData.address || !formData.city || !formData.state || !formData.lga) {
      toast.error("Please fill in all shipping details");
      return;
    }
  
    // Check if selected state is active
    const selectedState = availableStates.find(loc => loc.state === formData.state);
    if (!selectedState || !selectedState.isActive) {
      toast.error("Selected state is not available for delivery");
      return;
    }
  
    // Check if selected LGA is active
    const selectedLGA = selectedState.lgas.find(lga => lga.name === formData.lga);
    if (!selectedLGA || !selectedLGA.isActive) {
      toast.error("Selected LGA is not available for delivery");
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total + deliveryFee,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          lga: formData.lga,
          country: formData.country,
        },
        paymentMethod,
        deliveryFee,
        estimatedDays,
      };
  
      if (paymentMethod === "card") {
        // ✅ Create order first to get orderId
        const orderResponse = await OrderService.createOrder(orderData);
        
        if (!orderResponse.success) {
          toast.error(orderResponse.message || "Failed to create order");
          setIsProcessing(false);
          return;
        }
  
        const order = orderResponse.data;
  
        // ✅ Initialize Paystack payment with order metadata
        const paystackResponse = await PaystackService.initializePayment(
          formData.email,
          total + deliveryFee,
          { 
            orderId: order._id,        // ✅ Order ID for webhook
            userId: user?._id,         // ✅ User ID for reference
            orderReference: `ORD-${order._id.slice(-8)}`,
            deliveryFee: deliveryFee,
            itemsCount: items.length,
            timestamp: new Date().toISOString(),
          }
        );
  
        if (paystackResponse.success) {
          // Store order ID and reference for verification
          sessionStorage.setItem('pendingOrderId', order._id);
          sessionStorage.setItem('paymentReference', paystackResponse.data.reference);
          
          // Redirect to Paystack
          window.location.href = paystackResponse.data.authorization_url;
        } else {
          // If payment initialization fails, mark order as failed
          await OrderService.cancelOrder(order._id);
          throw new Error(paystackResponse.message || "Failed to initialize payment");
        }
      } else {
        // ✅ Wallet payment - create order and process immediately
        const response = await OrderService.createOrder(orderData);
  
        if (response.success) {
          toast.success("Order placed successfully!");
          clearCart();
          navigate("/orders");
        } else {
          toast.error(response.message || "Failed to place order");
        }
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingLocations) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  const activeStateCount = availableStates.filter(s => s.isActive).length;

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-brand-text mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <h2 className="text-xl font-semibold text-brand-text mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-brand-primary" />
                Shipping Information
              </h2>

              {availableStates.length === 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">No delivery locations available</p>
                      <p className="text-sm text-yellow-700">Please check back later or contact support.</p>
                    </div>
                  </div>
                </div>
              )}
              
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
                
                {/* State Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleStateChange}
                      className={`w-full rounded-lg border p-3 pr-10 focus:outline-none focus:ring-2 appearance-none ${
                        locationError 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-brand-primary"
                      }`}
                      required
                    >
                      <option value="">Select State</option>
                      {availableStates
                        .filter(loc => loc.isActive)
                        .sort((a, b) => a.state.localeCompare(b.state))
                        .map((loc) => (
                          <option key={loc.state} value={loc.state}>
                            {loc.state} {loc.lgas.filter(l => l.isActive).length > 0 ? `(${loc.lgas.filter(l => l.isActive).length} LGAs)` : ""}
                          </option>
                        ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {locationError && (
                    <p className="text-sm text-red-500 mt-1">{locationError}</p>
                  )}
                  {formData.state && !locationError && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle size={12} />
                      {availableLGAs.length} LGAs available
                    </p>
                  )}
                </div>

                {/* LGA Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LGA <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="lga"
                      value={formData.lga}
                      onChange={handleLGAChange}
                      disabled={!formData.state || availableLGAs.length === 0}
                      className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select LGA</option>
                      {availableLGAs.map((lga) => (
                        <option key={lga} value={lga}>
                          {lga}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {formData.state && availableLGAs.length === 0 && !locationError && (
                    <p className="text-xs text-yellow-600 mt-1">No active LGAs for this state</p>
                  )}
                </div>

                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              {/* Delivery Summary */}
              {formData.state && formData.lga && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-medium">{estimatedDays} business days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{formData.lga}, {formData.state}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Payment Method */}
            <Card>
              <h2 className="text-xl font-semibold text-brand-text)] mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-brand-primary" />
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-brand-primary" />
                    <div>
                      <p className="font-medium">Card Payment</p>
                      <p className="text-sm text-gray-500">Pay with debit/credit card via Paystack</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-5 h-5 text-brand-primary"
                  />
                </label>
                
                <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Wallet size={20} className="text-brand-primary" />
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
                    className="w-5 h-5 text-brand-primary"
                  />
                </label>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold text-brand-text mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.images?.[0] || "https://via.placeholder.com/60x60"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
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
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>₦{deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-brand-primary">
                    ₦{(total + deliveryFee).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={handleSubmit}
                disabled={isProcessing || availableStates.length === 0}
              >
                {isProcessing ? <Spinner size="sm" /> : (
                  <>
                    {paymentMethod === "card" ? "Pay with Card" : "Pay with Wallet"}
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