import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PropertyService, dummyProperties } from "@/services/property.service";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertySearch } from "@/components/properties/PropertySearch";
import { Button, Spinner, Pagination } from "@/ui";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import Container from "@/ui/components/Container";
import { PropertyListItem } from "@/components/properties/PropertyListItem";
import { useCompareStore } from "@/store/compare.store";

const USE_DUMMY_DATA = true;

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
  const { getCompareCount } = useCompareStore();
  const compareCount = getCompareCount();

  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", page, filters, searchQuery],
    queryFn: () =>
      USE_DUMMY_DATA
        ? PropertyService.getDummyProperties()
        : PropertyService.list({
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

  const getFilteredDummyData = () => {
    let filtered = [...dummyProperties];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p?.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p?.location.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter((p) => p.type === filters.type);
    }

    if (filters.city) {
      filtered = filtered.filter((p) => p.location.city === filters.city);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    }

    if (filters.bedrooms) {
      const bedrooms = Number(filters.bedrooms);
      filtered = filtered.filter((p) => p.features.bedrooms >= bedrooms);
    }

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    return filtered;
  };

  const getDisplayData = () => {
    if (USE_DUMMY_DATA) {
      const filtered = getFilteredDummyData();
      const start = (page - 1) * 12;
      const end = start + 12;
      return {
        data: filtered.slice(start, end),
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / 12),
      };
    }
    return {
      data: data?.data || [],
      total: data?.total || 0,
      totalPages: data?.totalPages || 1,
    };
  };

  const displayData = getDisplayData();
  const properties = displayData.data;
  const totalPages = displayData.totalPages;

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

  if (error && !USE_DUMMY_DATA) {
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
          {USE_DUMMY_DATA && (
            <div className="mt-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              ⚡ Demo Mode - Using Sample Data
            </div>
          )}
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
          Found {displayData.total} properties
        </div>

        {isLoading && !USE_DUMMY_DATA ? (
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
        ) : viewMode === "grid" ? (
          <PropertyGrid properties={properties} />
        ) : (
          <div className="space-y-4">
            {properties.map((property: any) => (
              <PropertyListItem key={property._id} property={property} />
            ))}
          </div>
        )}

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
