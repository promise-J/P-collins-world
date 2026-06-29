import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CategoryService, Category } from "@/services/category.service";
import { Card, Button, Spinner, Badge } from "@/ui";
import { 
  List, 
  Search, 
  ArrowRight, 
  ChevronRight,
  Grid3X3,
  Layers,
  Tag,
  Plus,
  Grid
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import Container from "@/ui/components/Container";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
  });

  const categories = data?.data || [];

  // Filter categories based on search
  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category: Category) => {
    navigate(`/products?category=${category.slug}`);
  };

  const handleSubCategoryClick = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    navigate(`/products?category=${category.slug}`);
  };

  const renderCategoryCard = (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;

    return (
      <motion.div
        key={category._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group"
        >
          <div className="relative">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-[var(--color-brand-primary)]/10 to-[var(--color-brand-secondary)]/10 rounded-lg flex items-center justify-center">
                <Layers size={48} className="text-gray-300" />
              </div>
            )}
            {hasChildren && (
              <Badge variant="primary" className="absolute top-2 right-2">
                {category.children?.length} Subcategories
              </Badge>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button variant="secondary" className="bg-white text-[var(--color-brand-primary)] hover:bg-gray-100">
                Browse {category.name}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-[var(--color-brand-text)]">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">
                {category.isActive ? "Active" : "Inactive"}
              </span>
              {hasChildren && (
                <div className="flex flex-wrap gap-1">
                  {category.children?.slice(0, 3).map((child) => (
                    <button
                      key={child._id}
                      onClick={(e) => handleSubCategoryClick(e, child)}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"
                    >
                      {child.name}
                    </button>
                  ))}
                  {category.children && category.children.length > 3 && (
                    <span className="text-xs px-2 py-1 text-gray-400">
                      +{category.children.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderCategoryListItem = (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;

    return (
      <motion.div
        key={category._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border-b border-gray-100 last:border-0"
      >
        <div 
          className="flex flex-wrap items-center justify-between gap-4 py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          onClick={() => handleCategoryClick(category)}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Tag size={24} className="text-gray-300" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-[var(--color-brand-text)]">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-500 line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {hasChildren && (
              <span className="text-sm text-gray-400">
                {category.children?.length} subcategories
              </span>
            )}
            <Badge variant={category.isActive ? "success" : "default"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
            {hasChildren && (
              <div className="flex -space-x-1">
                {category.children?.slice(0, 2).map((child) => (
                  <span
                    key={child._id}
                    className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                  >
                    {child.name}
                  </span>
                ))}
                {category.children && category.children.length > 2 && (
                  <span className="text-xs px-2 py-1 text-gray-400">
                    +{category.children.length - 2}
                  </span>
                )}
              </div>
            )}
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load categories</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-2">
              <Layers size={28} className="text-[var(--color-brand-primary)]" />
              Categories
            </h1>
            <p className="text-gray-500 mt-1">
              Browse products by category
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {categories.length} categories available
            </p>
          </div>
          <div className="flex items-center gap-3">
            {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
              <Link to="/admin/categories/create">
                <Button>
                  <Plus size={18} className="mr-2" />
                  Add Category
                </Button>
              </Link>
            )}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Categories Grid/List */}
        {filteredCategories.length === 0 ? (
          <Card className="text-center py-12">
            <Tag size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-600">No Categories Found</h3>
            <p className="text-gray-400 mt-1">
              {searchTerm ? "Try adjusting your search" : "No categories available"}
            </p>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category: Category) => renderCategoryCard(category))}
          </div>
        ) : (
          <Card className="p-2">
            {filteredCategories.map((category: Category) => renderCategoryListItem(category))}
          </Card>
        )}

        {/* Subcategories Section */}
        {viewMode === "grid" && filteredCategories.some((c: Category) => c.children?.length ?? 0 > 0) && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <Grid size={20} className="text-[var(--color-brand-primary)]" />
              Explore Subcategories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCategories
                .flatMap((category: Category) => category.children || [])
                .slice(0, 8)
                .map((subcategory: Category) => (
                  <motion.div
                    key={subcategory._id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleCategoryClick(subcategory)}
                  >
                    <div className="flex items-center gap-3">
                      {subcategory.image ? (
                        <img
                          src={subcategory.image}
                          alt={subcategory.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Tag size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--color-brand-text)] truncate">
                          {subcategory.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {subcategory.description || "Explore products"}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}