import { PropertyCard } from "./PropertyCard";

// 1. Define an explicit interface for the component props
interface PropertyGridProps {
  properties: any[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {/* 2. Added a defensive check to prevent runtime crashes if properties is undefined */}
      {properties?.map((property: any) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
