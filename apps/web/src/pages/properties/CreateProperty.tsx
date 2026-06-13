import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { PropertyService } from "@/services/property.service";
import { Button, Card, Input, TextArea, Spinner } from "@/ui";
import { 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Toilet, 
  Sofa, 
  Image as ImageIcon, 
  X, 
  Plus,
  Building2,
  DollarSign
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";

export default function CreatePropertyPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => {
        const parentValue = prev[parent as keyof typeof prev]
        return {
            ...prev,
            [parent]: {
              ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
              [child]: type === "number" ? Number(value) : value,
            },
        }
      });
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
    const newImages = [...images, ...files];
    setImages(newImages);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const createPropertyMutation = useMutation({
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
      
      images.forEach((image) => {
        formDataToSend.append("media", image);
      });
      
      return PropertyService.create(formDataToSend);
    },
    onSuccess: () => {
      toast.success("Property listed successfully!");
      navigate("/properties");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create property");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error("Please upload at least one property image");
      return;
    }
    
    createPropertyMutation.mutate();
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">List Your Property</h1>
          <p className="text-gray-500 mt-1">Fill in the details to list your property on our platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-6 flex items-center gap-2">
              <Home size={20} className="text-[var(--color-brand-primary)]" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="OCCUPIED">Occupied</option>
                  </select>
                </div>
              </div>
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
              <Building2 size={20} className="text-[var(--color-brand-primary)]" />
              Property Features
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
                  name="furnished"
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
            
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus size={32} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload property images</p>
                  <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
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
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/properties")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPropertyMutation.isPending}
              className="min-w-[150px]"
            >
              {createPropertyMutation.isPending ? <Spinner size="sm" /> : "List Property"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}