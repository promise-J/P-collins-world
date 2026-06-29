import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/services/cart.service";
import { WishlistService } from "@/services/wishlist.service";
import { Badge, Button, Card, Spinner } from "@/ui";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Heart } from "lucide-react";
import toast from "react-hot-toast";

export function ProductCard({ product }: any) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  // ✅ Extract image URLs from the new structure
  const images = product.images?.map((img: any) => 
    typeof img === 'string' ? img : img.url
  ) || [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is in wishlist
  useEffect(() => {
    if (isAuthenticated && product._id) {
      WishlistService.checkInWishlist(product._id)
        .then((response) => {
          setIsInWishlist(response.data?.isFavorited || false);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, product._id]);

  // ✅ Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: string; quantity: number; price: number }) =>
      CartService.addToCart(data.productId, data.quantity, data.price),
    onSuccess: () => {
      toast.success('Added to cart!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });

  // ✅ Wishlist toggle mutation
  const wishlistMutation = useMutation({
    mutationFn: async () => {
      if (isInWishlist) {
        return WishlistService.removeFromWishlist(product._id);
      } else {
        return WishlistService.addToWishlist(product._id);
      }
    },
    onSuccess: () => {
      setIsInWishlist(!isInWishlist);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    },
  });

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    // ✅ Check if product is in stock
    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }
    
    addToCartMutation.mutate({
      productId: product._id,
      quantity: 1,
      price: product.price,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to save to wishlist");
      navigate("/login");
      return;
    }
    
    wishlistMutation.mutate();
  };

  const displayImage = images.length > 0 ? images[currentSlide] : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Slider */}
      <div className="relative h-56 w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={displayImage}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          alt={product.name}
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistMutation.isPending}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all ${
            isInWishlist 
              ? "bg-red-500 text-white hover:bg-red-600" 
              : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
          aria-label="Add to wishlist"
        >
          {wishlistMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart size={16} className={isInWishlist ? "fill-white" : ""} />
          )}
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger" className="text-lg px-4 py-2">Out of Stock</Badge>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant={product.status === "ACTIVE" ? "success" : "danger"}>
            {product.status === "ACTIVE" ? "In Stock" : product.status}
          </Badge>
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="warning">Low Stock: {product.stock} left</Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold line-clamp-1 hover:text-[var(--color-brand-primary)] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-[var(--color-brand-primary)]">
            ₦{product.price?.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="text-yellow-400">★</span>
            {product.rating || 0} ({product.totalReviews || 0})
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleViewDetails} variant="ghost" className="flex-1">
            Details
          </Button>
          <Button 
            onClick={handleAddToCart} 
            variant="primary"
            className="flex-1"
            disabled={product.stock === 0 || addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? (
              <Spinner size="sm" />
            ) : (
              <>
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}