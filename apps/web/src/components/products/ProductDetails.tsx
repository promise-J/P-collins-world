import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Heart, Share2, ChevronLeft, Check } from 'lucide-react';
import { Button, Card, Badge, Spinner } from '@/ui';
import { ProductGallery } from './ProductGallery';
import { ProductRatings } from './ProductRatings';
import { ProductVariant } from './ProductVariant';
import { ProductRecommendations } from './ProductRecommendations';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { CartService } from '@/services/cart.service';
import { ProductService } from '@/services/product.service';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getOne(id!),
    enabled: !!id,
  });

  // Add to cart mutation
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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCartMutation.mutate({
      productId: id!,
      quantity,
      price: selectedVariant?.price || product?.price,
    });
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      navigate('/login');
      return;
    }
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${id}`;
    await navigator.clipboard.writeText(url);
    toast.success('Product link copied!');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Product not found</p>
        <Button onClick={() => navigate('/products')} className="mt-4">
          Back to Shop
        </Button>
      </div>
    );
  }

  const productData = product.data || product;


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-primary)] mb-6"
      >
        <ChevronLeft size={20} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <ProductGallery images={productData.images} title={productData.name} />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">
                {productData.name}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={handleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    size={24}
                    fill={isFavorited ? 'var(--color-brand-primary)' : 'transparent'}
                    className={isFavorited ? 'text-[var(--color-brand-primary)]' : 'text-gray-400'}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Share2 size={24} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Rating */}
            {productData.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <ProductRatings rating={productData.rating} totalReviews={productData.totalReviews} />
              </div>
            )}

            {/* Price */}
            <div className="mt-4">
              <span className="text-3xl font-bold text-[var(--color-brand-primary)]">
                ₦{productData.price?.toLocaleString()}
              </span>
              {productData.comparePrice && (
                <span className="ml-2 text-lg text-gray-400 line-through">
                  ₦{productData.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              {productData.stock > 0 ? (
                <Badge variant="success">In Stock ({productData.stock} available)</Badge>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{productData.description}</p>
          </div>

          {/* Variants */}
          {productData.variants && productData.variants.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-semibold mb-2">Options</h3>
              <ProductVariant
                variants={productData.variants}
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity >= productData.stock}
                >
                  +
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={productData.stock === 0 || addToCartMutation.isPending}
                className="flex-1"
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
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-16">
        <ProductRecommendations productId={id!} />
      </div>
    </div>
  );
}