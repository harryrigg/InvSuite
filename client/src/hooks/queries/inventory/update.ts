import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import api from "@/lib/api";
import { handleMutationError } from "@/lib/error";
import { InventoryItem, UpsertInventoryItem } from "@/lib/types/inventory";
import { ValidationErrorData } from "@/lib/types/utils";

type Error = AxiosError<ValidationErrorData<UpsertInventoryItem>>;

interface Args {
  id: string;
  form: ReturnType<typeof useForm<UpsertInventoryItem>>;
  onSuccess: () => void;
}

export function useUpdateInventoryItem({ id, form, onSuccess }: Args) {
  const queryClient = useQueryClient();

  return useMutation<InventoryItem, Error, UpsertInventoryItem>({
    mutationKey: ["inventory_item", "update", id],
    mutationFn: async (details: UpsertInventoryItem) =>
      api.put(`/api/inventory/${id}`, details).then((resp) => resp.data),
    onSuccess: (data) => {
      queryClient.setQueryData(["inventory_item", id], data);
      onSuccess();
    },
    onError: (e) => handleMutationError(e, form),
  });
}
