import { PropertyService } from "@/services/property.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useInView } from "react-intersection-observer";

export function InfinitePropertyGrid() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["properties"],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      PropertyService.list({
        page: pageParam,
      }),

    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <div>
      Property Grid
      <div ref={ref} />
    </div>
  );
}
