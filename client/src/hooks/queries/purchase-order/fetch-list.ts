import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import {
  PurchaseOrder,
  PurchaseOrderAPI,
  transformPurchaseOrder,
} from "@/lib/types/purchase-order";

export function useFetchPurchaseOrderList() {
  return useQuery<PurchaseOrder[]>({
    queryKey: ["purchase-order"],
    queryFn: () =>
      api
        .get<PurchaseOrderAPI[]>("/api/purchase-order")
        .then((resp) => resp.data.map(transformPurchaseOrder)),
  });
}
