import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService, Category } from "@/services/category.service";
import { Card, Button, Spinner, Badge, Modal, Input } from "@/ui";
import { Plus, Edit, Trash2, Eye, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    parentId: "",
    order: 0,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
  });

  const categories = data?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Failed to delete category"),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => CategoryService.createCategory(data),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowModal(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      CategoryService.updateCategory(id, data),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      setShowModal(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update category"),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      parentId: "",
      order: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredCategories = categories.filter((cat: Category) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">Manage Categories</h1>
          <p className="text-gray-500 mt-1">Create and manage product categories</p>
        </div>
        <Button onClick={() => { setEditingCategory(null); resetForm(); setShowModal(true); }}>
          <Plus size={18} className="mr-2" />
          Add Category
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map((category: Category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{category.name}</p>
                        {category.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">{category.slug}</td>
                  <td className="px-4 py-3">
                    <Badge variant={category.isActive ? "success" : "default"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">{category.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/categories/${category.slug}`}>
                        <button className="p-1 rounded hover:bg-gray-100" title="View">
                          <Eye size={16} className="text-gray-500" />
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setFormData({
                            name: category.name,
                            description: category.description || "",
                            image: category.image || "",
                            parentId: category.parentId?.toString() || "",
                            order: category.order || 0,
                          });
                          setShowModal(true);
                        }}
                        className="p-1 rounded hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit size={16} className="text-gray-500" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${category.name}"?`)) {
                            deleteMutation.mutate(category._id);
                          }
                        }}
                        className="p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        title={editingCategory ? "Edit Category" : "Create Category"}
        onClose={() => { setShowModal(false); resetForm(); }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            label="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
              <select
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
              >
                <option value="">None (Top Level)</option>
                {categories.map((cat: Category) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1">
              {editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}