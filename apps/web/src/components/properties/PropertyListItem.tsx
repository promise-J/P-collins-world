import { useNavigate } from "react-router-dom";
import { Badge, Button } from "@/ui";
import { Eye, GitCompare, MapPin, Bed, Bath, Square } from "lucide-react";
import toast from "react-hot-toast";
import { useCompareStore } from "@/store/compare.store";

export function PropertyListItem({ property }: any) {
  const navigate = useNavigate();
  const { addToCompare, removeFromCompare, isInCompare } = useCompareStore();
  const isCompared = isInCompare(property._id);
  const firstImage = property.media?.find((m: any) => m.type === "image")?.url || property.coverImage;

  const handleViewDetails = () => {
    navigate(`/properties/${property._id}`);
  };

  const handleCompare = () => {
    if (isCompared) {
      removeFromCompare(property._id);
      toast.success("Removed from comparison");
    } else {
      addToCompare(property);
      toast.success("Added to comparison");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-64 h-48 md:h-auto">
          <img
            src={firstImage || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div className="flex gap-2">
              <Badge variant={property.status === "AVAILABLE" ? "success" : "warning"}>
                {property.status}
              </Badge>
              {property.isFeatured && (
                <Badge variant="primary">Featured</Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-[var(--color-brand-primary)]">
              ₦{property.price?.toLocaleString()}
            </p>
          </div>

          <h3 className="text-xl font-semibold text-[var(--color-brand-text)] mb-2">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 mb-3">
            <MapPin size={14} />
            <span className="text-sm">
              {property.location?.address}, {property.location?.city}, {property.location?.state}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-4">
            {property.features?.bedrooms > 0 && (
              <div className="flex items-center gap-1 text-gray-500">
                <Bed size={16} />
                <span className="text-sm">{property.features.bedrooms} beds</span>
              </div>
            )}
            {property.features?.bathrooms > 0 && (
              <div className="flex items-center gap-1 text-gray-500">
                <Bath size={16} />
                <span className="text-sm">{property.features.bathrooms} baths</span>
              </div>
            )}
            {property.features?.toilets > 0 && (
              <div className="flex items-center gap-1 text-gray-500">
                <Square size={16} />
                <span className="text-sm">{property.features.toilets} toilets</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleViewDetails}>
              <Eye size={16} className="mr-1" />
              View Details
            </Button>
            <Button onClick={handleCompare} variant={isCompared ? "primary" : "secondary"}>
              <GitCompare size={16} className="mr-1" />
              {isCompared ? "Added to Compare" : "Compare"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}