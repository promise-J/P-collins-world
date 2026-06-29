import { useState } from "react";
import { Card, Button, Badge, Spinner, Pagination } from "@/ui";
import { Search, Plus, Edit, Trash2, Eye, Package, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "DISABLED";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    inStock: false,
  });

  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: "danger" | "warning" | "info";
    onConfirm: () => void;
    loading?: boolean;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Fetch categories for filter dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
  });
  const categories = categoriesData?.data || [];

  // Fetch products with real API
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-products", page, search, filters],
    queryFn: () =>
      ProductService.list({
        page,
        limit: 10,
        search: search || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        rating: filters.rating ? Number(filters.rating) : undefined,
        inStock: filters.inStock || undefined,
      }),
  });

  const products = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductService.delete(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
      setConfirmationModal(prev => ({ ...prev, open: false }));
    },
  });

  // Status toggle mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ProductService.update(id, { status: status as ProductStatus }),
    onSuccess: (data) => {
      toast.success(`Product ${data.data.status === "ACTIVE" ? "activated" : "disabled"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product status");
    },
  });

  const handleDelete = (id: string, productName: string) => {
    setConfirmationModal({
      open: true,
      title: "Delete Product",
      message: `Are you sure you want to delete "${productName}"? This action cannot be undone and all associated data will be lost.`,
      confirmText: "Delete Product",
      variant: "danger",
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  const handleStatusToggle = (id: string, currentStatus: string, productName: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    const action = newStatus === "ACTIVE" ? "activate" : "disable";
    setConfirmationModal({
      open: true,
      title: `${newStatus === "ACTIVE" ? "Activate" : "Disable"} Product`,
      message: `Are you sure you want to ${action} "${productName}"?`,
      confirmText: newStatus === "ACTIVE" ? "Activate" : "Disable",
      variant: newStatus === "ACTIVE" ? "info" : "warning",
      onConfirm: () => toggleStatusMutation.mutate({ id, status: newStatus }),
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
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
    setSearch("");
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load products</p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Products</h1>
          <p className="text-gray-500 mt-1">Manage all products on the platform</p>
          <p className="text-sm text-gray-400 mt-1">Total: {total} products</p>
        </div>
        <Link to="/admin/products/create">
          <Button>
            <Plus size={18} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            showFilters ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/5" : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <Filter size={18} />
          <span>Filters</span>
          {(filters.category || filters.minPrice || filters.maxPrice || filters.rating || filters.inStock) && (
            <Badge variant="primary" className="ml-1">
              {Object.values(filters).filter(v => v).length}
            </Badge>
          )}
        </button>

        {(filters.category || filters.minPrice || filters.maxPrice || filters.rating || filters.inStock) && (
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--color-brand-primary)] hover:underline flex items-center gap-1"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Categories</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₦)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder="Min"
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₦)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder="Max"
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">All Ratings</option>
                <option value="4">4★ & above</option>
                <option value="3">3★ & above</option>
                <option value="2">2★ & above</option>
                <option value="1">1★ & above</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange("inStock", e.target.checked)}
                  className="w-4 h-4 text-[var(--color-brand-primary)] rounded focus:ring-[var(--color-brand-primary)]"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sales</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.data?.map((product: any) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0]?.url || "https://via.placeholder.com/40"}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400">
                          {product.categoryId?.name || "Uncategorized"}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ₦{product.price?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock <= 5 ? "text-red-500 font-medium" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.salesCount || 0}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      product.status === "ACTIVE" ? "success" :
                      product.status === "OUT_OF_STOCK" ? "warning" : "danger"
                    }>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/products/${product._id}`}>
                        <button className="p-1 rounded hover:bg-gray-100" title="View">
                          <Eye size={16} className="text-gray-500" />
                        </button>
                      </Link>
                      <Link to={`/admin/products/${product._id}/edit`}>
                        <button className="p-1 rounded hover:bg-gray-100" title="Edit">
                          <Edit size={16} className="text-gray-500" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleStatusToggle(product._id, product.status, product.name)}
                        className="p-1 rounded hover:bg-gray-100"
                        title={product.status === "ACTIVE" ? "Disable" : "Activate"}
                      >
                        <Package size={16} className={product.status === "ACTIVE" ? "text-green-500" : "text-gray-400"} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No products found matching your criteria</p>
          <Button onClick={clearFilters} variant="ghost" className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText || "Confirm"}
        variant={confirmationModal.variant || "danger"}
        loading={deleteMutation.isPending || toggleStatusMutation.isPending}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
}