import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService, dummyProducts } from "@/services/product.service";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductFilters } from "@/components/catalog/ProductFilters";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { Button, Spinner, Pagination } from "@/ui";
import { SlidersHorizontal, Grid3X3, List, Plus } from "lucide-react";
import Container from "@/ui/components/Container";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { ProductListItem } from "@/components/products/ProductListItem";

// Set this to false to use real API, true to use dummy data
const USE_DUMMY_DATA = false;

export default function ProductsPage() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    inStock: false,
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Use real API or dummy data
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page, filters, searchQuery],
    queryFn: () =>
      USE_DUMMY_DATA
        ? ProductService.getDummyProducts()
        : ProductService.list({
            page,
            limit: 12,
            category: filters.category || undefined,
            minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
            maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
            rating: filters.rating ? Number(filters.rating) : undefined,
            inStock: filters.inStock,
            search: searchQuery || undefined,
          }),
  });


  const getDisplayData = () => {
    return {
      data: data?.data.data || [],
      total: data?.total || 0,
      totalPages: data?.totalPages || 1,
    };
  };


  const displayData = getDisplayData();
  const products = displayData.data;
  const totalPages = displayData.totalPages;

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      inStock: false,
    });
    setSearchQuery("");
    setPage(1);
  };

  if (error && !USE_DUMMY_DATA) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load products</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Container>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)] mb-2">
              Shop Our Marketplace
            </h1>
            <p className="text-gray-600">
              Discover quality products from trusted vendors
            </p>
            {USE_DUMMY_DATA && (
              <div className="mt-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                ⚡ Demo Mode - Using Sample Data
              </div>
            )}
          </div>
          {(user?.role === "VENDOR" || user?.role === "ADMIN") && (
            <Link to="/products/create">
              <Button>
                <Plus size={18} className="mr-2" />
                Add Product
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <ProductSearch value={searchQuery} onChange={handleSearch} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>
            {(filters.category ||
              filters.minPrice ||
              filters.maxPrice ||
              filters.rating ||
              filters.inStock) && (
              <button
                onClick={clearFilters}
                className="text-sm text-[var(--color-brand-primary)] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--color-brand-primary)] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--color-brand-primary)] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <ProductFilters
              onFilterChange={handleFilterChange}
              initialFilters={{
                category: filters.category,
                rating: filters.rating,
                inStock: filters.inStock,
              }}
            />
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500">
          Found {displayData.total} products
        </div>

        {/* Product Grid / List */}
        {isLoading && !USE_DUMMY_DATA ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No products found matching your criteria
            </p>
            <Button onClick={clearFilters} variant="ghost" className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <ProductGrid products={products} />
        ) : (
          <div className="space-y-4">
            {products.map((product: any) => (
              <ProductListItem key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </Container>
  );
}