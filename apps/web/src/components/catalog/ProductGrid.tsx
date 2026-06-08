import { ProductCard } from './ProductCard';
import { EmptyState } from '@/ui/feedback/EmptyState';

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products = [], loading, columns = 4 }: ProductGridProps) {
  // FIX 1: Appended the mandatory 'grid gap-6' classes so things actually render side-by-side
  const columnClasses = {
    2: "grid gap-6 grid-cols-1 md:grid-cols-2",
    3: "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (loading) {
    return (
      <div className={columnClasses[columns]}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-56 rounded-lg" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // FIX 2: Strict defensive array check to handle raw API objects or wrappers gracefully
  const cleanProducts = Array.isArray(products) ? products : [];

  if (cleanProducts.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your search or filter criteria"
      />
    );
  }

  return (
    <div className={columnClasses[columns]}>
      {cleanProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
