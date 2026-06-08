import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";


export function RecentlyViewedProperties() {
  const ids = useRecentlyViewed((state) => state.propertyIds);

  return (
    <div>
      Recently Viewed
      {ids.length}
      Properties
    </div>
  );
}
