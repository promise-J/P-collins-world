import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Property {
  id: string;
  title: string;
  images: string[];
}

export function useProperty(id: string | undefined) {
  return useQuery<Property>({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id) throw new Error("Property ID is required");
      const response = await axios.get(`/api/properties/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
