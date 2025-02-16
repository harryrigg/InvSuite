import { useMutation } from "@tanstack/react-query";

import api from "@/lib/api";
import { toastGenericError } from "@/lib/utils";

interface Args {
  id: string;
  onSuccess: () => void;
}

export function useDeletePurchaseOrder({ id, onSuccess }: Args) {
  return useMutation({
    mutationKey: ["purchase-order", "delete", id],
    mutationFn: () => api.delete(`/api/purchase-order/${id}`),
    onSuccess,
    onError: () => toastGenericError(),
  });
}
