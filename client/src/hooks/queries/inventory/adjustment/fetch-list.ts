import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import {
  Adjustment,
  AdjustmentAPI,
  transformAdjustment,
} from "@/lib/types/adjustment";

interface Args {
  id: string;
}

export function useFetchInventoryItemAdjustmentList({ id }: Args) {
  return useQuery<Adjustment[]>({
    queryKey: ["inventory_item", id, "adjustments"],
    queryFn: () =>
      api
        .get<AdjustmentAPI[]>(`/api/inventory/${id}/adjustment`)
        .then((res) => res.data.map(transformAdjustment)),
  });
}
