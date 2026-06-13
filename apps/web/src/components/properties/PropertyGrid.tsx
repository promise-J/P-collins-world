import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  properties: any[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties?.map((property: any) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
