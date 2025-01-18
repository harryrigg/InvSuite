import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import {
  InventoryItem,
  InventoryItemAPI,
  transformInventoryItem,
} from "@/lib/types/inventory";

export function useFetchInventoryItemList() {
  return useQuery<InventoryItem[]>({
    queryKey: ["inventory_items"],
    queryFn: () =>
      api
        .get<InventoryItemAPI[]>("/api/inventory")
        .then((resp) => resp.data.map(transformInventoryItem)),
  });
}
