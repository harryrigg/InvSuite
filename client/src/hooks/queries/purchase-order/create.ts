import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import api from "@/lib/api";
import { handleMutationError } from "@/lib/error";
import { CreatePurchaseOrder, PurchaseOrder } from "@/lib/types/purchase-order";
import { ValidationErrorData } from "@/lib/types/utils";

type Error = AxiosError<ValidationErrorData<CreatePurchaseOrder>>;

interface Args {
  form: ReturnType<typeof useForm<CreatePurchaseOrder>>;
  onSuccess: (data: PurchaseOrder) => void;
}

export function useCreatePurchaseOrder({ form, onSuccess }: Args) {
  return useMutation<PurchaseOrder, Error, CreatePurchaseOrder>({
    mutationKey: ["purchase-order", "create"],
    mutationFn: (details: CreatePurchaseOrder) =>
      api.post("/api/purchase-order", details).then((resp) => resp.data),
    onSuccess,
    onError: (e) => handleMutationError(e, form),
  });
}
