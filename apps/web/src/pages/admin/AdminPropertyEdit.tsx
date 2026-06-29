import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PropertyService } from "@/services/property.service";
import { Button, Card, Input, TextArea, Spinner } from "@/ui";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus, 
  Image as ImageIcon,
  MapPin,
  Bed,
  Bath,
  Toilet,
  Sofa,
  Building2,
  DollarSign,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "APARTMENT",
    status: "AVAILABLE",
    location: {
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      toilets: 0,
      furnished: false,
    },
    isFeatured: false,
    approvalStatus: "pending",
  });

  const [existingMedia, setExistingMedia] = useState<any[]>([]);

  // Fetch property details
  const { data, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => PropertyService.getOne(id!),
    enabled: !!id,
  });

  const property = data?.data || data;

  // Populate form with property data
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        price: property.price?.toString() || "",
        type: property.type || "APARTMENT",
        status: property.status || "AVAILABLE",
        location: {
          address: property.location?.address || "",
          city: property.location?.city || "",
          state: property.location?.state || "",
          country: property.location?.country || "Nigeria",
        },
        features: {
          bedrooms: property.features?.bedrooms || 0,
          bathrooms: property.features?.bathrooms || 0,
          toilets: property.features?.toilets || 0,
          furnished: property.features?.furnished || false,
        },
        isFeatured: property.isFeatured || false,
        approvalStatus: property.approvalStatus || "pending",
      });
      setExistingMedia(property.media || []);
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any> || {}),
          [child]: type === "number" ? Number(value) : value,
        },
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: parseInt(value) || 0,
      },
    }));
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
    const imageToRemove = existingMedia[index];
    setImagesToRemove(prev => [...prev, imageToRemove.publicId]);
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updatePropertyMutation = useMutation({
    mutationFn: async () => {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("location[address]", formData.location.address);
      formDataToSend.append("location[city]", formData.location.city);
      formDataToSend.append("location[state]", formData.location.state);
      formDataToSend.append("location[country]", formData.location.country);
      formDataToSend.append("features[bedrooms]", formData.features.bedrooms.toString());
      formDataToSend.append("features[bathrooms]", formData.features.bathrooms.toString());
      formDataToSend.append("features[toilets]", formData.features.toilets.toString());
      formDataToSend.append("features[furnished]", String(formData.features.furnished));
      formDataToSend.append("isFeatured", String(formData.isFeatured));
      formDataToSend.append("approvalStatus", formData.approvalStatus);
      
      // Add images to remove
      if (imagesToRemove.length > 0) {
        formDataToSend.append("imagesToRemove", JSON.stringify(imagesToRemove));
      }
      
      // Add new images
      newImages.forEach((image) => {
        formDataToSend.append("images", image);
      });
      
      return PropertyService.update(id!, formDataToSend);
    },
    onSuccess: () => {
      toast.success("Property updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["property", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      navigate("/admin/properties");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update property");
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: () => PropertyService.delete(id!),
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      navigate("/admin/properties");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete property");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Please enter property title");
      return;
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    updatePropertyMutation.mutate();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deletePropertyMutation.mutate();
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

  if (!property) {
    return (
      <Container>
        <div className="text-center py-16">
          <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The property you're looking for doesn't exist.
          </p>
          <Link to="/admin/properties">
            <Button>Back to Properties</Button>
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
              onClick={() => navigate("/admin/properties")}
              className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors mb-2"
            >
              <ArrowLeft size={20} />
              Back to Properties
            </button>
            <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">
              Edit Property
            </h1>
            <p className="text-gray-500 mt-1">
              Update property details and manage images
            </p>
          </div>
          <Button onClick={handleDelete} variant="danger">
            Delete Property
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-[var(--color-brand-primary)]" />
              Basic Information
            </h2>
            
            <div className="space-y-5">
              <Input
                label="Property Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Luxury 3-Bedroom Apartment in Lekki"
                required
              />
              
              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property in detail..."
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                    required
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="LAND">Land</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Status
                  </label>
                  <select
                    name="approvalStatus"
                    value={formData.approvalStatus}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[var(--color-brand-primary)] rounded"
                />
                <span className="text-sm text-gray-700">Feature this property</span>
              </label>
            </div>
          </Card>

          {/* Location */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-[var(--color-brand-primary)]" />
              Location
            </h2>
            
            <div className="space-y-5">
              <Input
                label="Street Address"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                placeholder="Enter street address"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  label="City"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos"
                  required
                />
                <Input
                  label="State"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  placeholder="e.g., Lagos"
                  required
                />
                <Input
                  label="Country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  placeholder="Nigeria"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              Features
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="relative">
                <Input
                  label="Bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.features.bedrooms}
                  onChange={handleFeatureChange}
                  placeholder="0"
                />
                <Bed size={18} className="absolute left-3 top-[42px] text-gray-400" />
              </div>
              
              <div className="relative">
                <Input
                  label="Bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.features.bathrooms}
                  onChange={handleFeatureChange}
                  placeholder="0"
                />
                <Bath size={18} className="absolute left-3 top-[42px] text-gray-400" />
              </div>
              
              <div className="relative">
                <Input
                  label="Toilets"
                  name="toilets"
                  type="number"
                  value={formData.features.toilets}
                  onChange={handleFeatureChange}
                  placeholder="0"
                />
                <Toilet size={18} className="absolute left-3 top-[42px] text-gray-400" />
              </div>
              
              <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Sofa size={18} className="text-[var(--color-brand-primary)]" />
                  <span className="text-sm font-medium">Furnished</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.features.furnished}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    features: { ...prev.features, furnished: e.target.checked }
                  }))}
                  className="w-5 h-5 text-[var(--color-brand-primary)] rounded"
                />
              </label>
            </div>
          </Card>

          {/* Images */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <ImageIcon size={20} className="text-[var(--color-brand-primary)]" />
              Property Images
            </h2>
            
            {/* Existing Images */}
            {existingMedia.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Current Images</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {existingMedia.map((media, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={media.url}
                        alt={`Property ${index + 1}`}
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
                High-quality images help your property sell faster. Recommended: 800x800 pixels.
              </p>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/admin/properties")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updatePropertyMutation.isPending}
              className="min-w-[150px]"
            >
              {updatePropertyMutation.isPending ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone and all associated data will be lost."
        confirmText="Delete Property"
        variant="danger"
        loading={deletePropertyMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Container>
  );
}