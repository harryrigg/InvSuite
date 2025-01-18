import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import api from "@/lib/api";
import { handleMutationError } from "@/lib/error";
import { InventoryItem, UpsertInventoryItem } from "@/lib/types/inventory";
import { ValidationErrorData } from "@/lib/types/utils";

type Error = AxiosError<ValidationErrorData<UpsertInventoryItem>>;

interface Args {
  form: ReturnType<typeof useForm<UpsertInventoryItem>>;
  onSuccess: (data: InventoryItem) => void;
}

export function useCreateInventoryItem({ form, onSuccess }: Args) {
  return useMutation<InventoryItem, Error, UpsertInventoryItem>({
    mutationKey: ["inventory_item", "create"],
    mutationFn: (details: UpsertInventoryItem) =>
      api.post("/api/inventory", details).then((resp) => resp.data),
    onSuccess,
    onError: (e) => handleMutationError(e, form),
  });
}
