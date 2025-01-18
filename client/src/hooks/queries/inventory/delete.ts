import { useMutation } from "@tanstack/react-query";

import api from "@/lib/api";
import { toastGenericError } from "@/lib/utils";

interface Args {
  id: string;
  onSuccess: () => void;
}

export function useDeleteInventoryItem({ id, onSuccess }: Args) {
  return useMutation({
    mutationKey: ["inventory_item", "delete", id],
    mutationFn: () => api.delete(`/api/inventory/${id}`),
    onSuccess,
    onError: () => toastGenericError(),
  });
}
