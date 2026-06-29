import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OrderService } from "@/services/order.service";
import { useCartStore } from "@/store/cart.store";
import { Spinner, Button } from "@/ui";
import { CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { PaystackService } from "@/services/paystack.service";

export default function PaymentVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const { clearCart } = useCartStore();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else {
      setStatus("failed");
      setMessage("No payment reference found");
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      // ✅ Verify payment with Paystack
      const response = await PaystackService.verifyPayment(reference!);
      
      if (response.success && response.data.status === "success") {
        setStatus("success");
        setMessage("Payment successful! Your order has been confirmed.");
        toast.success("Payment verified successfully");
        
        // ✅ Get order ID from session storage
        const pendingOrderId = sessionStorage.getItem('pendingOrderId');
        
        if (pendingOrderId) {
          // ✅ Mark order as paid
          await OrderService.markAsPaid(pendingOrderId, reference!);
          clearCart();
          sessionStorage.removeItem('pendingOrderId');
          sessionStorage.removeItem('paymentReference');
        }
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/orders");
        }, 3000);
      } else {
        setStatus("failed");
        setMessage(response.message || "Payment verification failed");
        toast.error("Payment verification failed");
      }
    } catch (error: any) {
      setStatus("failed");
      setMessage(error.message || "Failed to verify payment");
      toast.error("Failed to verify payment");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "success" ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={() => navigate("/orders")} className="w-full">
              View Orders
            </Button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={() => navigate("/checkout")} className="w-full">
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}