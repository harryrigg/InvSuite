import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import api from "@/lib/api";
import { handleMutationError } from "@/lib/error";
import {
  PurchaseOrder,
  PurchaseOrderAPI,
  UpdatePurchaseOrder,
  transformPurchaseOrder,
} from "@/lib/types/purchase-order";
import { ValidationErrorData } from "@/lib/types/utils";

type Error = AxiosError<ValidationErrorData<UpdatePurchaseOrder>>;

interface Args {
  id: string;
  form: ReturnType<typeof useForm<UpdatePurchaseOrder>>;
  onSuccess: (data: PurchaseOrder) => void;
}

export function useUpdatePurchaseOrder({ id, form, onSuccess }: Args) {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrderAPI, Error, UpdatePurchaseOrder>({
    mutationKey: ["purchase-order", id, "update"],
    mutationFn: (details: UpdatePurchaseOrder) =>
      api.put(`/api/purchase-order/${id}`, details).then((resp) => resp.data),
    onSuccess: (data) => {
      const purchaseOrder = transformPurchaseOrder(data);
      queryClient.setQueryData(["purchase-order", id], purchaseOrder);
      queryClient.invalidateQueries({
        queryKey: ["purchase-order", id, "lines"],
      });
      onSuccess(purchaseOrder);
    },
    onError: (e) => handleMutationError(e, form),
  });
}
