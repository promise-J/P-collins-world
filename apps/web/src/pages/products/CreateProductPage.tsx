import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { Button, Card, Input, TextArea, Spinner } from "@/ui";
import { 
  Package, 
  DollarSign, 
  Tag, 
  Layers, 
  Image as ImageIcon, 
  X, 
  Plus,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "",
    status: "ACTIVE",
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAllCategories(),
  });

  const categories = categoriesData?.data || [];

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
    
    const newImages = [...images, ...validFiles];
    if (newImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    
    setImages(newImages);
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const createProductMutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("status", formData.status);
      
      // ✅ Append each image with the field name "images"
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });
      
      return ProductService.create(formDataToSend);
    },
    onSuccess: () => {
      toast.success("Product listed successfully!");
      navigate("/admin/products");
    },
    onError: (error: any) => {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || "Failed to create product");
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
    
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    
    createProductMutation.mutate();
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">List a Product</h1>
          <p className="text-gray-500 mt-1">Fill in the details to list your product on the marketplace</p>
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
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
            
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus size={32} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload product images</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB (Max 5 images)</p>
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
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="text-blue-500 mt-0.5" />
              <p className="text-xs text-blue-600">
                High-quality images help your product sell faster. Recommended: 800x800 pixels, white background.
              </p>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProductMutation.isPending}
              className="min-w-[150px]"
            >
              {createProductMutation.isPending ? <Spinner size="sm" /> : "List Product"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}