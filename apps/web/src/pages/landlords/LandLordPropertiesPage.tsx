import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PropertyService } from "@/services/property.service";
import { Button, Card, Spinner, Badge } from "@/ui";
import { Plus, Edit, Trash2, Eye, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function LandlordProperties() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["landlord-properties", page],
    queryFn: () => PropertyService.list({ page, limit: 10, status: "all" }),
  });

  const properties = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await PropertyService.delete(id);
        toast.success("Property deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">My Properties</h1>
          <p className="text-gray-500 mt-1">Manage your rental properties</p>
        </div>
        <Link to="/properties/create">
          <Button>
            <Plus size={18} className="mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <Card className="text-center py-12">
          <Home size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-600">No Properties Yet</h3>
          <p className="text-gray-400 mt-1">Start by adding your first property</p>
          <Link to="/properties/create">
            <Button className="mt-4">
              <Plus size={18} className="mr-2" />
              Add Property
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {properties.map((property: any) => (
            <Card key={property._id} className="p-4">
              <div className="flex flex-wrap gap-4">
                <img
                  src={property.media?.[0]?.url || "https://via.placeholder.com/120x80"}
                  alt={property.title}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <p className="text-sm text-gray-500">{property.location?.address}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={property.status === "AVAILABLE" ? "success" : "warning"}>
                          {property.status}
                        </Badge>
                        <Badge variant={property.approvalStatus === "approved" ? "success" : "warning"}>
                          {property.approvalStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[var(--color-brand-primary)]">
                        ₦{property.price?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">per {property.type === "LAND" ? "plot" : "month"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to={`/properties/${property._id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/landlord/properties/${property._id}/edit`}>
                      <Button variant="secondary" size="sm">
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(property._id)}>
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}