import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import {
  PurchaseOrderLine,
  PurchaseOrderLineAPI,
  transformPurchaseOrderLine,
} from "@/lib/types/purchase-order-line";

interface Args {
  purchaseOrderId: string;
}

export function useFetchPurchaseOrderLineList({ purchaseOrderId }: Args) {
  return useQuery<PurchaseOrderLine[]>({
    queryKey: ["purchase-order-line"],
    queryFn: () =>
      api
        .get<
          PurchaseOrderLineAPI[]
        >(`/api/purchase-order/${purchaseOrderId}/lines`)
        .then((resp) => resp.data.map(transformPurchaseOrderLine)),
  });
}
