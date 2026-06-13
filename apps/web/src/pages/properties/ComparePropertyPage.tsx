import { useCompareStore } from "@/store/compare.store";
import { Button, Card, Badge } from "@/ui";
import { Trash2, X, Home, MapPin, DollarSign, Bed, Bath, Toilet, Sofa } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "@/ui/components/Container";

export default function ComparePropertiesPage() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();

  if (compareList.length === 0) {
    return (
      <Container>
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--color-brand-text)] mb-2">
            No Properties to Compare
          </h2>
          <p className="text-gray-500 mb-6">
            Add properties to compare by clicking the compare button on any property card.
          </p>
          <Link to="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-text)]">
              Compare Properties
            </h1>
            <p className="text-gray-500 mt-1">
              Comparing {compareList.length} property{compareList.length > 1 ? 'ies' : ''}
            </p>
          </div>
          <Button onClick={clearCompare} variant="danger">
            <Trash2 size={16} className="mr-2" />
            Clear All
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-sm font-medium text-gray-600 border w-48">
                  Feature
                </th>
                {compareList.map((property) => (
                  <th key={property._id} className="p-4 text-left border min-w-[280px]">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(property._id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <img
                        src={property.media?.[0]?.url || "https://via.placeholder.com/300x200"}
                        alt={property.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-[var(--color-brand-text)]">
                        {property.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{property.location?.city}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Price */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Price</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <span className="text-lg font-bold text-[var(--color-brand-primary)]">
                      ₦{property.price?.toLocaleString()}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Status */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Status</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <Badge variant={property.status === "AVAILABLE" ? "success" : "warning"}>
                      {property.status}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Property Type */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Property Type</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4 capitalize">
                    {property.type?.toLowerCase()}
                  </td>
                ))}
              </tr>

              {/* Location */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Location</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <div className="flex items-start gap-1">
                      <MapPin size={14} className="text-gray-400 mt-0.5" />
                      <span className="text-sm">
                        {property.location?.address}, {property.location?.city}, {property.location?.state}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Bedrooms */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Bedrooms</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <div className="flex items-center gap-1">
                      <Bed size={16} className="text-gray-400" />
                      <span>{property.features?.bedrooms || 0}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Bathrooms */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Bathrooms</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <div className="flex items-center gap-1">
                      <Bath size={16} className="text-gray-400" />
                      <span>{property.features?.bathrooms || 0}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Toilets */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Toilets</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <div className="flex items-center gap-1">
                      <Toilet size={16} className="text-gray-400" />
                      <span>{property.features?.toilets || 0}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Furnished */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Furnished</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <div className="flex items-center gap-1">
                      <Sofa size={16} className="text-gray-400" />
                      <span>{property.features?.furnished ? "Yes" : "No"}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr>
                <td className="p-4 font-medium text-gray-700 align-top">Description</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {property.description}
                    </p>
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 font-medium text-gray-700">Actions</td>
                {compareList.map((property) => (
                  <td key={property._id} className="p-4">
                    <Link to={`/properties/${property._id}`}>
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Back to Properties Button */}
        <div className="mt-8 text-center">
          <Link to="/properties">
            <Button variant="secondary">← Back to Properties</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}