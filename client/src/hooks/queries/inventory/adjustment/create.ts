import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import api from "@/lib/api";
import { handleMutationError } from "@/lib/error";
import { CreateAdjustment } from "@/lib/types/adjustment";
import { ValidationErrorData } from "@/lib/types/utils";

type Error = AxiosError<ValidationErrorData<CreateAdjustment>>;

interface Args {
  inventoryItemId: string;
  form: ReturnType<typeof useForm<CreateAdjustment>>;
  onSuccess: () => void;
}

export function useCreateInventoryItemAdjustment({
  inventoryItemId,
  form,
  onSuccess,
}: Args) {
  return useMutation<unknown, Error, CreateAdjustment>({
    mutationKey: ["inventory_item", inventoryItemId, "adjustment", "create"],
    mutationFn: (details: CreateAdjustment) =>
      api
        .post(`/api/inventory/${inventoryItemId}/adjustment`, details)
        .then((resp) => resp.data),
    onSuccess,
    onError: (e) => handleMutationError(e, form),
  });
}
