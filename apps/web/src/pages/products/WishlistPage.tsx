import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WishlistService } from "@/services/wishlist.service";
import { Button, Card, Spinner, Badge } from "@/ui";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Eye, 
  ShoppingCart,
  Star,
  X
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { motion, AnimatePresence } from "framer-motion";
import { getFirstImageUrl } from "@/utils/imageHelper";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const queryClient = useQueryClient();

  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
    loading?: boolean;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Container>
        <div className="text-center py-16">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            Login to View Your Wishlist
          </h2>
          <p className="text-gray-500 mb-6">
            Sign in to access your saved items and continue shopping
          </p>
          <Link to="/login">
            <Button>Login Now</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => WishlistService.getWishlist(),
    enabled: isAuthenticated,
  });

  const wishlistItems = data?.data || [];

  const removeMutation = useMutation({
    mutationFn: (productId: string) => WishlistService.removeFromWishlist(productId),
    onSuccess: () => {
      toast.success("Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove from wishlist");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => WishlistService.clearWishlist(),
    onSuccess: () => {
      toast.success("Wishlist cleared");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to clear wishlist");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  const handleRemove = (productId: string, productName: string) => {
    setItemToRemove({ id: productId, name: productName });
    setConfirmationModal({
      open: true,
      title: "Remove from Wishlist",
      message: `Are you sure you want to remove "${productName}" from your wishlist?`,
      confirmText: "Remove",
      variant: "warning",
      onConfirm: () => removeMutation.mutate(productId),
    });
  };

  const handleClearAll = () => {
    if (wishlistItems.length === 0) {
      toast.error("No items to clear");
      return;
    }
    setConfirmationModal({
      open: true,
      title: "Clear Wishlist",
      message: "Are you sure you want to remove all items from your wishlist? This action cannot be undone.",
      confirmText: "Clear All",
      variant: "danger",
      onConfirm: () => clearMutation.mutate(),
    });
  };

  const handleAddToCart = (product: any) => {
    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }
    addToCart({
      _id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      images: product.images || [],
    });
  };

  const handleMoveAllToCart = async () => {
    let addedCount = 0;
    const itemsToRemove: string[] = [];
    
    for (const item of wishlistItems) {
      const product = item.productId;
      if (product.stock > 0 && product.status === "ACTIVE") {
        addToCart({
          _id: product._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
          images: product.images || [],
        });
        addedCount++;
        itemsToRemove.push(product._id);
      }
    }
    
    // Remove all moved items from wishlist
    for (const id of itemsToRemove) {
      await WishlistService.removeFromWishlist(id);
    }
    
    toast.success(`${addedCount} items moved to cart`);
    queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    refetch();
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
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-3">
              <Heart size={28} className="text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-500 mt-1">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div className="flex gap-3">
            {wishlistItems.length > 0 && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleMoveAllToCart}
                  disabled={wishlistItems.every((item: any) => 
                    item.productId.stock === 0 || item.productId.status !== "ACTIVE"
                  )}
                >
                  Move All to Cart
                </Button>
                <Button
                  variant="danger"
                  onClick={handleClearAll}
                  disabled={clearMutation.isPending}
                >
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <Card className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-brand-text)] mb-2">
              Your Wishlist is Empty
            </h3>
            <p className="text-gray-500 mb-6">
              Start saving your favorite products and build your wishlist
            </p>
            <Link to="/products">
              <Button>
                Start Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item: any) => {
                const product = item.productId;
                const isOutOfStock = product.stock === 0 || product.status !== "ACTIVE";

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 hover:shadow-xl transition-all duration-300 group relative">
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(product._id, product.name)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors z-10"
                        aria-label="Remove from wishlist"
                      >
                        <X size={16} className="text-gray-400 hover:text-red-500" />
                      </button>

                      <Link to={`/products/${product._id}`}>
                        <div className="relative">
                          <img
                            src={getFirstImageUrl(product.images, "https://via.placeholder.com/300x300?text=No+Image")}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image";
                            }}
                          />
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <Badge variant="danger" className="px-4 py-2 text-sm">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                          {product.rating > 0 && (
                            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                              <Star size={14} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-white text-xs font-medium">
                                {product.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="mt-4">
                        <Link to={`/products/${product._id}`}>
                          <h3 className="font-semibold text-[var(--color-brand-text)] hover:text-[var(--color-brand-primary)] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xl font-bold text-[var(--color-brand-primary)]">
                            ₦{product.price?.toLocaleString()}
                          </p>
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="text-xs text-orange-500 font-medium">
                              Only {product.stock} left
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Link to={`/products/${product._id}`} className="flex-1">
                            <Button variant="ghost" className="w-full">
                              View
                            </Button>
                          </Link>
                          <Button
                            className="flex-1"
                            onClick={() => handleAddToCart(product)}
                            disabled={isOutOfStock}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText || "Confirm"}
        variant={confirmationModal.variant || "danger"}
        loading={removeMutation.isPending || clearMutation.isPending}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => {
          setConfirmationModal(prev => ({ ...prev, open: false }));
          setItemToRemove(null);
        }}
      />
    </Container>
  );
}