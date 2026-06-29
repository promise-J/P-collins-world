import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { Button, Card, Input, TextArea, Spinner } from "@/ui";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Image as ImageIcon,
  Package,
  DollarSign,
  Layers,
  AlertCircle,
  Tag
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "",
    status: "ACTIVE",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Fetch product details
  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductService.getOne(id!),
    enabled: !!id,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
  });

  const product = data?.data || data;
  const categories = categoriesData?.data || [];

  // Populate form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        categoryId: product.categoryId?._id || product.categoryId || "",
        stock: product.stock?.toString() || "",
        status: product.status || "ACTIVE",
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (validFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }
    
    const newImagesList = [...newImages, ...validFiles];
    if (newImagesList.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    
    setNewImages(newImagesList);
    
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (index: number) => {
    const imageToRemove = existingImages[index];
    setImagesToRemove(prev => [...prev, imageToRemove]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateProductMutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("status", formData.status);
      
      // Add images to remove
      if (imagesToRemove.length > 0) {
        formDataToSend.append("imagesToRemove", JSON.stringify(imagesToRemove));
      }
      
      // Add new images
      newImages.forEach((image) => {
        formDataToSend.append("images", image);
      });
      
      return ProductService.updateWithFiles(id!, formDataToSend);
    },
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/products");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: () => ProductService.delete(id!),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/products");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Please enter product name");
      return;
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    
    updateProductMutation.mutate();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteProductMutation.mutate();
    setShowDeleteModal(false);
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

  if (!product) {
    return (
      <Container>
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/admin/products">
            <Button>Back to Products</Button>
          </Link>
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
            <button
              onClick={() => navigate("/admin/products")}
              className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors mb-2"
            >
              <ArrowLeft size={20} />
              Back to Products
            </button>
            <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">
              Edit Product
            </h1>
            <p className="text-gray-500 mt-1">
              Update product details and manage images
            </p>
          </div>
          <Button onClick={handleDelete} variant="danger">
            Delete Product
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <Package size={20} className="text-[var(--color-brand-primary)]" />
              Basic Information
            </h2>
            
            <div className="space-y-5">
              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., iPhone 15 Pro Max"
                required
              />
              
              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product in detail..."
                rows={4}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <Input
                    label="Price (₦)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    required
                  />
                  <DollarSign size={18} className="absolute left-3 top-[42px] text-gray-400" />
                </div>
                
                <div className="relative">
                  <Input
                    label="Stock Quantity"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Enter stock quantity"
                    required
                  />
                  <Layers size={18} className="absolute left-3 top-[42px] text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Product Images */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <ImageIcon size={20} className="text-[var(--color-brand-primary)]" />
              Product Images
            </h2>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Current Images</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* New Images */}
            {newImagePreviews.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">New Images</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upload Button */}
            <div>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus size={32} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload new images</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB (Max 10 images)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-600">
                High-quality images help your product sell faster. Recommended: 800x800 pixels.
              </p>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProductMutation.isPending}
              className="min-w-[150px]"
            >
              {updateProductMutation.isPending ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and all associated data will be lost."
        confirmText="Delete Product"
        variant="danger"
        loading={deleteProductMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Container>
  );
}