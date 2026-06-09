import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';
import { ProductGrid } from '../catalog/ProductGrid';
import { Spinner } from '@/ui';

interface ProductRecommendationsProps {
  productId: string;
  limit?: number;
}

export function ProductRecommendations({ productId, limit = 4 }: ProductRecommendationsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['product-recommendations', productId],
    queryFn: () => ProductService.getRecommendations(productId),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const products = data?.data || [];

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[var(--color-brand-text)] mb-6">
        You May Also Like
      </h2>
      <ProductGrid products={products.slice(0, limit)} />
    </div>
  );
}