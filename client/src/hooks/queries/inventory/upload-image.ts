import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/api";
import { ValidationErrorData } from "@/lib/types/utils";

type Error = AxiosError<ValidationErrorData<{ image: unknown }>>;

interface Args {
  inventoryItemId: string;
  onSuccess: () => void;
  onError: (e: Error) => void;
}

export function useUploadInventoryItemImage({
  inventoryItemId,
  onSuccess,
  onError,
}: Args) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["inventory_item", inventoryItemId, "image", "upload"],
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return api.post(`/api/inventory/${inventoryItemId}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory_item", inventoryItemId, "image"],
      });
      onSuccess();
    },
    onError,
  });
}
