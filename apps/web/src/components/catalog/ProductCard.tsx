import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Badge, Button, Card } from "@/ui";
import { ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
import toast from "react-hot-toast";

export function ProductCard({ product }: any) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const images = product.images || [];
  const [currentSlide, setCurrentSlide] = useState(0);

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
    addToCart({
      _id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
    });
    
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
            <Eye size={16} className="mr-1" />
          </Button>
          <Button 
            onClick={handleAddToCart} 
            variant="primary"
            className="flex-1 justify-center items-center"
            disabled={product.stock === 0}
          >
            <ShoppingCart size={16} className="mr-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}