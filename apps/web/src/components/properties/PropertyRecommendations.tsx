import { PropertyService } from "@/services/property.service";
import { PropertyGrid } from "./PropertyGrid";
import { useQuery } from "@tanstack/react-query";

interface PropertyRecommendationsProps {
  propertyId: string;
}

export function PropertyRecommendations({ propertyId }: PropertyRecommendationsProps) {
  const { data } = useQuery({
    queryKey: ["property-recommendations", propertyId],

    queryFn: () => PropertyService.recommendations(),
  });

  return <PropertyGrid properties={data || []} />;
}
