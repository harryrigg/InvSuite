import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import { InventoryItem } from "@/lib/types/inventory";

interface Args {
  id: string;
}

export function useFetchInventoryItem({ id }: Args) {
  return useQuery<InventoryItem>({
    queryKey: ["inventory_item", id],
    queryFn: () => api.get(`/api/inventory/${id}`).then((resp) => resp.data),
  });
}
