import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PropertyService } from "@/services/property.service";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertySearch } from "@/components/properties/PropertySearch";
import { Button, Spinner, Pagination } from "@/ui";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import Container from "@/ui/components/Container";

export default function PropertiesPage() {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    status: "AVAILABLE",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", page, filters, searchQuery],
    queryFn: () =>
      PropertyService.list({
        page,
        limit: 12,
        type: filters.type || undefined,
        city: filters.city || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        status: filters.status || undefined,
        search: searchQuery || undefined,
      }),
  });

  const properties = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      status: "AVAILABLE",
    });
    setSearchQuery("");
    setPage(1);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load properties</p>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-brand-text)] mb-2">
          Find Your Dream Property
        </h1>
        <p className="text-gray-600">
          Discover thousands of verified properties for rent and sale
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <PropertySearch value={searchQuery} onChange={handleSearch} />
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
          {(filters.type ||
            filters.city ||
            filters.minPrice ||
            filters.maxPrice ||
            filters.bedrooms) && (
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
          <PropertyFilters
            onFilterChange={handleFilterChange}
            initialFilters={{
              type: filters.type,
              city: filters.city,
              bedrooms: filters.bedrooms,
              status: filters.status,
            }}
          />
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500">
        Found {data?.total || 0} properties
      </div>

      {/* Property Grid / List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No properties found matching your criteria
          </p>
          <Button onClick={clearFilters} variant="ghost" className="mt-4">
            Clear Filters
          </Button>
        </div>
      ) : (
        <PropertyGrid properties={properties} />
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
