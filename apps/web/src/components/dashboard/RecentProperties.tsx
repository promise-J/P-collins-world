import { Link } from "react-router-dom";
import { Card, Badge, Button } from "@/ui";
import { Building2, Plus } from "lucide-react";

interface RecentPropertiesProps {
  properties: any[];
  viewAllLink: string;
  addLink?: string;
  showAddButton?: boolean;
}

export function RecentProperties({ properties, viewAllLink, addLink, showAddButton = false }: RecentPropertiesProps) {
  return (
    <Card className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--color-brand-text)]">Recent Properties</h2>
        <Link to={viewAllLink} className="text-sm text-[var(--color-brand-primary)] hover:underline">
          View All
        </Link>
      </div>
      
      {properties?.length === 0 ? (
        <div className="text-center py-8">
          <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No properties listed yet</p>
          {showAddButton && addLink && (
            <Link to={addLink}>
              <Button variant="secondary" className="mt-3">
                <Plus size={16} className="mr-2" />
                Add Your First Property
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {properties?.slice(0, 3).map((property: any) => (
            <Link key={property._id} to={`/properties/${property._id}`}>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src={property.media?.[0]?.url || "https://via.placeholder.com/60"}
                  alt={property.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{property.title}</p>
                  <p className="text-xs text-gray-500">{property.location?.city}</p>
                </div>
                <Badge variant={property.status === "AVAILABLE" ? "success" : "warning"}>
                  {property.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}