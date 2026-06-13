import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PropertyService } from "@/services/property.service";
import { Button, Badge, Spinner, Tabs } from "@/ui";
import {
  Bed,
  Bath,
  Toilet,
  Sofa,
  MapPin,
  Calendar,
  User,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  Home,
  Ruler,
  Zap,
  Shield,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import Container from "@/ui/components/Container";
import { motion } from "framer-motion";
import { PropertyVerificationBadge } from "@/components/properties/PropertyVerificationBadge";
import { FavoriteButton } from "@/components/properties/FavoriteButton";
import { SharePropertyButton } from "@/components/properties/SharePropertyButton";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyMap } from "@/components/properties/PropertyMap";
import { PropertyStats } from "@/components/properties/PropertyStats";
import { InspectionBookingModal } from "@/components/properties/InspectionBookingModel";
import { PropertyRecommendations } from "@/components/properties/PropertyRecommendations";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["property", id],
    queryFn: () => PropertyService.getOne(id!),
    enabled: !!id,
  });

  const property = data?.data || data;

  // Check if property is favorited
  useEffect(() => {
    if (isAuthenticated && id) {
      PropertyService.checkFavorite(id).then((res) => {
        setIsFavorite(res.data?.isFavorited || false);
      });
    }
  }, [id, isAuthenticated]);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save favorites");
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        await PropertyService.removeFavorite(id!);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await PropertyService.addFavorite(id!);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
      refetch();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/properties/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Property link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleContactAgent = () => {
    const agentPhone =
      property?.agentId?.phone ||
      property?.landlordId?.phone ||
      "+2348000000000";
    window.location.href = `tel:${agentPhone}`;
  };

  const handleMessageAgent = () => {
    // This could open a chat modal or redirect to messaging
    toast.success("Messaging feature coming soon");
  };

  if (isLoading) {
    return (
      <Container>
        <div className="py-8">
          <div className="animate-pulse">
            <div className="h-[400px] bg-gray-200 rounded-xl mb-6" />
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-gray-200 rounded" />
                <div className="h-32 bg-gray-200 rounded" />
              </div>
              <div className="h-64 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container>
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/properties")}>
            Browse Properties
          </Button>
        </div>
      </Container>
    );
  }

  const tabs = [
    { label: "Details", value: "details" },
    { label: "Features", value: "features" },
    { label: "Location", value: "location" },
    { label: "Reviews", value: "reviews" },
  ];

  return (
    <Container>
      <div className="py-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/properties")}
          className="flex items-center gap-2 text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Properties
        </button>

        {/* Title & Actions */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <Badge
                variant={
                  property.status === "AVAILABLE" ? "success" : "warning"
                }
              >
                {property.status}
              </Badge>
              {property.isFeatured && <Badge variant="primary">Featured</Badge>}
              {property.approvalStatus === "approved" && (
                <PropertyVerificationBadge verified={true} />
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-text)] mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin size={18} />
              <span>
                {property.location?.address}, {property.location?.city},{" "}
                {property.location?.state}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <FavoriteButton favorite={isFavorite} onClick={handleFavorite} />
            <SharePropertyButton propertyId={id!} />
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-[var(--color-brand-primary)]">
            ₦{property.price?.toLocaleString()}
          </span>
          {property.price && (
            <span className="text-gray-500">
              / {property.type === "LAND" ? "plot" : "property"}
            </span>
          )}
        </div>

        {/* Gallery */}
        <PropertyGallery media={property.media || []} title={property.title} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {property.features?.bedrooms > 0 && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Bed
                    size={24}
                    className="text-[var(--color-brand-primary)]"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="text-xl font-semibold">
                      {property.features.bedrooms}
                    </p>
                  </div>
                </div>
              )}
              {property.features?.bathrooms > 0 && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Bath
                    size={24}
                    className="text-[var(--color-brand-primary)]"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="text-xl font-semibold">
                      {property.features.bathrooms}
                    </p>
                  </div>
                </div>
              )}
              {property.features?.toilets > 0 && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Toilet
                    size={24}
                    className="text-[var(--color-brand-primary)]"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Toilets</p>
                    <p className="text-xl font-semibold">
                      {property.features.toilets}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Sofa size={24} className="text-[var(--color-brand-primary)]" />
                <div>
                  <p className="text-sm text-gray-500">Furnished</p>
                  <p className="text-xl font-semibold">
                    {property.features?.furnished ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </motion.div>

            {/* Property Details Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-100 p-6"
            >
              <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Property Type</span>
                  <span className="font-medium capitalize">
                    {property.type?.toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Status</span>
                  <Badge
                    variant={
                      property.status === "AVAILABLE" ? "success" : "warning"
                    }
                  >
                    {property.status}
                  </Badge>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Listed On</span>
                  <span>
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-500">Total Views</span>
                  <span>{property.views || 0} views</span>
                </div>
              </div>
            </motion.div>

            {/* Features List */}
            {property.features && Object.keys(property.features).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-gray-100 p-6"
              >
                <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
                  Amenities & Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(property.features).map(([key, value]) => {
                    // 1. Assert type to allow evaluation and rendering safely
                    const val = value as string | number | boolean;

                    return (
                      val !== false &&
                      val !== 0 && (
                        <div key={key} className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-gray-600 capitalize">
                            {key}:{" "}
                            {typeof val === "boolean"
                              ? val
                                ? "Yes"
                                : "No"
                              : val}
                          </span>
                        </div>
                      )
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Location Map */}
            {property.location?.coordinates?.lat &&
              property.location?.coordinates?.lng && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-semibold text-[var(--color-brand-text)] mb-4">
                    Location Map
                  </h2>
                  <PropertyMap
                    lat={property.location.coordinates.lat}
                    lng={property.location.coordinates.lng}
                  />
                </motion.div>
              )}
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Agent/Landlord Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24"
            >
              <h3 className="text-lg font-semibold text-[var(--color-brand-text)] mb-4">
                Contact Information
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center text-white font-bold text-lg">
                  {property.landlordId?.firstName?.[0] ||
                    property.agentId?.firstName?.[0] ||
                    "A"}
                </div>
                <div>
                  <p className="font-medium">
                    {property.landlordId?.firstName}{" "}
                    {property.landlordId?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.landlordId ? "Property Owner" : "Listing Agent"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span className="text-sm">+234 800 000 0000</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">contact@example.com</span>
                </div>
              </div>

              <Button onClick={handleContactAgent} className="w-full mb-3">
                <Phone size={16} className="mr-2" />
                Call Agent
              </Button>

              <Button
                onClick={handleMessageAgent}
                variant="secondary"
                className="w-full"
              >
                <MessageCircle size={16} className="mr-2" />
                Send Message
              </Button>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowInspectionModal(true)}
                  className="w-full text-center text-sm text-[var(--color-brand-primary)] hover:underline"
                >
                  Schedule an Inspection
                </button>
              </div>
            </motion.div>

            {/* Stats Card */}
            <PropertyStats
              views={property.views || 0}
              favorites={0}
              shares={0}
              inspections={0}
            />

            {/* Inspection Booking Modal */}
            <InspectionBookingModal
              propertyId={id!}
              open={showInspectionModal}
              onClose={() => setShowInspectionModal(false)}
            />
          </div>
        </div>

        <PropertyRecommendations propertyId={id!} />
      </div>
    </Container>
  );
}
