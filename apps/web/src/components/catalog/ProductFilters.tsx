import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/category.service';

interface ProductFiltersProps {
  onFilterChange?: (key: string, value: any) => void;
  initialFilters?: {
    category?: string;
    rating?: string;
    inStock?: boolean;
  };
}

export function ProductFilters({ onFilterChange, initialFilters }: ProductFiltersProps) {
  const [category, setCategory] = useState(initialFilters?.category || '');
  const [rating, setRating] = useState(initialFilters?.rating || '');
  const [inStock, setInStock] = useState(initialFilters?.inStock || false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllCategories(),
  });

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange?.('category', value);
  };

  const handleRatingChange = (value: string) => {
    setRating(value);
    onFilterChange?.('rating', value);
  };

  const handleStockChange = (value: string) => {
    const inStockOnly = value === 'in-stock';
    setInStock(inStockOnly);
    onFilterChange?.('inStock', inStockOnly);
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <select
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        <option value="">All Categories</option>
        {categories?.data?.map((cat: any) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={rating}
        onChange={(e) => handleRatingChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        <option value="">All Ratings</option>
        <option value="4">4★ & above</option>
        <option value="3">3★ & above</option>
        <option value="2">2★ & above</option>
        <option value="1">1★ & above</option>
      </select>

      <select
        value={inStock ? 'in-stock' : 'all'}
        onChange={(e) => handleStockChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        <option value="all">All Items</option>
        <option value="in-stock">In Stock Only</option>
      </select>

      <select
        className="w-full rounded-lg border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
      >
        <option>Flash Sale</option>
        <option>All Items</option>
        <option>On Sale</option>
      </select>
    </div>
  );
}