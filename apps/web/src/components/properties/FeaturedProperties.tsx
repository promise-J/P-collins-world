import { useQuery } from "@tanstack/react-query";

import { PropertyGrid } from "./PropertyGrid";
import { PropertyService } from "@/services/property.service";

export function FeaturedProperties() {
  const { data } = useQuery({
    queryKey: ["featured-properties"],

    queryFn: () =>
      PropertyService.list({
        featured: true,
      }),
  });

  return <PropertyGrid properties={data?.data || []} />;
}
