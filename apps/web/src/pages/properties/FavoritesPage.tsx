import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PropertyService } from "@/services/property.service";
import { Card, Button, Spinner, Badge } from "@/ui";
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Toilet, 
  Sofa,
  Eye,
  ShoppingCart,
  Trash2,
  Home,
  Building2
} from "lucide-react";
import { ConfirmationModal } from "@/ui/overlays/ConfirmationModal";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { getFirstImageUrl } from "@/utils/imageHelper";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [propertyToRemove, setPropertyToRemove] = useState<string>("");
  const [propertyName, setPropertyName] = useState<string>("");

  // Fetch favorites
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => PropertyService.getFavorites(),
  });

  const favorites = data?.data || [];

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: (propertyId: string) => PropertyService.removeFavorite(propertyId),
    onSuccess: () => {
      toast.success("Removed from favorites");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      setShowRemoveModal(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove from favorites");
      setShowRemoveModal(false);
    },
  });

  // Clear all favorites mutation
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      // Remove each favorite one by one
      for (const fav of favorites) {
        await PropertyService.removeFavorite(fav.propertyId._id);
      }
    },
    onSuccess: () => {
      toast.success("All favorites cleared");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to clear favorites");
    },
  });

  const handleRemove = (propertyId: string, propertyName: string) => {
    setPropertyToRemove(propertyId);
    setPropertyName(propertyName);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    if (propertyToRemove) {
      removeFavoriteMutation.mutate(propertyToRemove);
    }
  };

  const handleClearAll = () => {
    if (favorites.length === 0) {
      toast.error("No favorites to clear");
      return;
    }
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      clearAllMutation.mutate();
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case "APARTMENT":
        return <Building2 size={16} className="text-gray-400" />;
      case "HOUSE":
        return <Home size={16} className="text-gray-400" />;
      case "LAND":
        return <MapPin size={16} className="text-gray-400" />;
      case "COMMERCIAL":
        return <Building2 size={16} className="text-gray-400" />;
      default:
        return <Building2 size={16} className="text-gray-400" />;
    }
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

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)] flex items-center gap-3">
              <Heart size={28} className="text-red-500 fill-red-500" />
              My Favorites
            </h1>
            <p className="text-gray-500 mt-1">
              {favorites.length} property{favorites.length !== 1 ? 'ies' : ''} saved
            </p>
          </div>
          {favorites.length > 0 && (
            <Button onClick={handleClearAll} variant="danger" disabled={clearAllMutation.isPending}>
              <Trash2 size={18} className="mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <Card className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-brand-text)] mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start saving properties you love by clicking the heart icon on any property.
            </p>
            <Link to="/properties">
              <Button>
                <Home size={18} className="mr-2" />
                Browse Properties
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite: any) => {
              const property = favorite.propertyId;
              if (!property) return null;

              return (
                <Card key={favorite._id} className="p-4 hover:shadow-xl transition-all duration-300 group relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(property._id, property.title)}
                    className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                    title="Remove from favorites"
                  >
                    <Heart size={16} className="text-red-500 fill-red-500" />
                  </button>

                  {/* Image */}
                  <Link to={`/properties/${property._id}`}>
                    <div className="relative">
                      <img
                        src={getFirstImageUrl(property.media, "https://via.placeholder.com/400x250")}
                        alt={property.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {property.status === "AVAILABLE" ? (
                        <Badge variant="success" className="absolute top-2 left-2">
                          Available
                        </Badge>
                      ) : property.status === "RESERVED" ? (
                        <Badge variant="warning" className="absolute top-2 left-2">
                          Reserved
                        </Badge>
                      ) : (
                        <Badge variant="danger" className="absolute top-2 left-2">
                          {property.status}
                        </Badge>
                      )}
                      {property.isFeatured && (
                        <Badge variant="primary" className="absolute top-2 left-24">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="mt-4">
                    <Link to={`/properties/${property._id}`}>
                      <h3 className="font-semibold text-[var(--color-brand-text)] hover:text-[var(--color-brand-primary)] transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span className="line-clamp-1">
                        {property.location?.city}, {property.location?.state}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                      {property.features?.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed size={14} />
                          <span>{property.features.bedrooms}</span>
                        </div>
                      )}
                      {property.features?.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath size={14} />
                          <span>{property.features.bathrooms}</span>
                        </div>
                      )}
                      {property.features?.toilets > 0 && (
                        <div className="flex items-center gap-1">
                          <Toilet size={14} />
                          <span>{property.features.toilets}</span>
                        </div>
                      )}
                      {property.features?.furnished && (
                        <div className="flex items-center gap-1">
                          <Sofa size={14} />
                          <span>Furnished</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        {getPropertyTypeIcon(property.type)}
                        <span>{property.type?.toLowerCase()}</span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xl font-bold text-[var(--color-brand-primary)]">
                          ₦{property.price?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {property.status === "AVAILABLE" ? "Price" : "Price on request"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/properties/${property._id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => {
                            toast.success("Added to cart");
                          }}
                        >
                          <ShoppingCart size={14} className="mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>

                    {/* Added date */}
                    <p className="text-xs text-gray-400 mt-3">
                      Added {new Date(favorite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Remove Confirmation Modal */}
        <ConfirmationModal
          open={showRemoveModal}
          title="Remove from Favorites"
          message={`Are you sure you want to remove "${propertyName}" from your favorites?`}
          confirmText="Remove"
          variant="warning"
          loading={removeFavoriteMutation.isPending}
          onConfirm={confirmRemove}
          onCancel={() => {
            setShowRemoveModal(false);
            setPropertyToRemove("");
            setPropertyName("");
          }}
        />
      </div>
    </Container>
  );
}