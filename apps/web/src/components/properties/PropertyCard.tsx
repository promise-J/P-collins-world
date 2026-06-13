import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "@/ui";
import { ChevronLeft, ChevronRight, Eye, GitCompare } from "lucide-react";
import toast from "react-hot-toast";
import { useCompareStore } from "@/store/compare.store";

export function PropertyCard({ property }: any) {
  const navigate = useNavigate();
  const { addToCompare, removeFromCompare, isInCompare } = useCompareStore();
  const images = property.media?.filter((m: any) => m.type === "image") || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const isCompared = isInCompare(property._id);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/properties/${property._id}`);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCompared) {
      removeFromCompare(property._id);
      toast.success("Removed from comparison");
    } else {
      addToCompare(property);
      toast.success("Added to comparison");
    }
  };

  const displayImage =
    images.length > 0
      ? images[currentSlide].url
      : property.coverImage ||
        "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Slider Wrapper */}
      <div className="relative h-60 w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={displayImage}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          alt={`${property.title} - Slide ${currentSlide + 1}`}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 text-gray-800 shadow-md backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 text-gray-800 shadow-md backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    idx === currentSlide ? "bg-white w-3" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Compare Badge */}
        <button
          onClick={handleCompare}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all ${
            isCompared
              ? "bg-[var(--color-brand-primary)] text-white"
              : "bg-white/80 text-gray-700 hover:bg-white"
          }`}
          aria-label="Compare"
        >
          <GitCompare size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Badge
            variant={property.status === "AVAILABLE" ? "success" : "warning"}
          >
            {property.status}
          </Badge>
          {property.isFeatured && <Badge variant="primary">Featured</Badge>}
        </div>

        <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>

        <p className="text-sm text-gray-500 line-clamp-1">
          {property.location?.address}, {property.location?.city}
        </p>

        <p className="text-xl font-bold text-[var(--color-brand-primary)]">
          ₦{property.price?.toLocaleString()}
        </p>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleViewDetails} className="flex-1">
            <Eye size={16} className="mr-1" />
            View Details
          </Button>
          <Link to="/properties/compare">
            <Button
              // onClick={handleCompare}
              variant={isCompared ? "primary" : "secondary"}
              className="flex-1"
            >
              <GitCompare size={16} className="mr-1" />
              {isCompared ? "Added" : "Compare"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
