import { PropertyService } from "@/services/property.service";
import { PropertyGrid } from "./PropertyGrid";
import { useQuery } from "@tanstack/react-query";

export function PropertyRecommendations() {
  const { data } = useQuery({
    queryKey: ["property-recommendations"],

    queryFn: PropertyService.recommendations,
  });

  return <PropertyGrid properties={data || []} />;
}
