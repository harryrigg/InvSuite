import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/api";

interface Args {
  inventoryItemId: string;
  onSuccess: () => void;
  onError: (e: AxiosError) => void;
}

export function useDeleteInventoryItemImage({
  inventoryItemId,
  onSuccess,
  onError,
}: Args) {
  const queryClient = useQueryClient();

  return useMutation<unknown, AxiosError>({
    mutationKey: ["inventory_item", inventoryItemId, "image", "delete"],
    mutationFn: () => {
      return api.delete(`/api/inventory/${inventoryItemId}/image`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["inventory_item", inventoryItemId, "image"],
      });
      onSuccess();
    },
    onError,
  });
}
