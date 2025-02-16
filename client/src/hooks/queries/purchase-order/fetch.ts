import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import {
  PurchaseOrder,
  transformPurchaseOrder,
} from "@/lib/types/purchase-order";

interface Args {
  id: string;
}

export function useFetchPurchaseOrder({ id }: Args) {
  return useQuery<PurchaseOrder>({
    queryKey: ["purchase-order", id],
    queryFn: () =>
      api
        .get(`/api/purchase-order/${id}`)
        .then((resp) => transformPurchaseOrder(resp.data)),
  });
}
