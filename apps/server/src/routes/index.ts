import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import adminRoutes from "../modules/admin/routes/admin.routes";
import kycRoutes from "../modules/kyc/kyc.routes";
import cartRoutes from "../modules/market/cart/cart.routes";
import orderRoutes from "../modules/market/orders/order.routes";
import productRoutes from "../modules/market/products/product.routes";
import couponRoutes from "../modules/market/coupons/coupon.routes";
import categoryRoutes from "../modules/market/categories/category.routes";
import reviewRoutes from "../modules/market/reviews/review.routes";
import propertyRoutes from "../modules/properties/property.routes";
import favoriteRoutes from "../modules/favorites/favorite.routes";
import inspectionRoutes from "../modules/inspections/inspection.routes";
import savingsRoutes from "../modules/savings/saving.routes";
import walletRoutes from "../modules/wallet/wallet.routes";
import notificationRoutes from "../modules/notifications/notification.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import auditRoutes from "../modules/audit/audit.routes";
import uploadRoutes from "../modules/uploads/upload.routes";
import settingsRoutes from "../modules/users/user-settings/user-settings.routes";
import wishlistRoutes from "../modules/wishlist/wishlist.routes"
import paymentRoutes from "../modules/payments/payment.routes"
import locationRoutes from "../modules/admin/location/location.routes"
import adminOrderRoutes from "../modules/admin/routes/admin-order.routes"


const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/kyc", kycRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/coupons", couponRoutes);
router.use("/categories", categoryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/properties", propertyRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/inspections", inspectionRoutes);
router.use("/savings", savingsRoutes);
router.use("/wallet", walletRoutes);
router.use("/notifications", notificationRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/audit", auditRoutes);
router.use("/upload", uploadRoutes);
router.use("/settings", settingsRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/payments", paymentRoutes);
router.use("/locations", locationRoutes);
router.use("/admin/orders", adminOrderRoutes);


export default router;