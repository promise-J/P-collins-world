import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { Button, Badge } from "@/ui";
import { Eye, ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";

export function ProductListItem({ product }: any) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();

  const handleViewDetails = () => {
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

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-48 h-48 md:h-auto">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div className="flex gap-2">
              <Badge variant={product.status === "ACTIVE" ? "success" : "danger"}>
                {product.status === "ACTIVE" ? "In Stock" : product.status}
              </Badge>
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="warning">Low Stock</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-primary)]">
              ₦{product.price?.toLocaleString()}
            </p>
          </div>

          <h3 className="text-xl font-semibold text-[var(--color-brand-text)] mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating || 0) 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.totalReviews || 0} reviews)
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button className="flex-row" onClick={handleViewDetails}>
              <Eye size={16} className="mr-1" />
            </Button>
            <Button 
              onClick={handleAddToCart} 
              variant="secondary"
              disabled={product.stock === 0}
            >
              <ShoppingCart size={16} className="mr-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}