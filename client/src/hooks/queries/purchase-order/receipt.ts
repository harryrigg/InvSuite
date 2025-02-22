import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";
import {
  PurchaseOrder,
  PurchaseOrderAPI,
  ReceiptPurchaseOrder,
  transformPurchaseOrder,
} from "@/lib/types/purchase-order";
import { ValidationErrorData } from "@/lib/types/utils";
import { toastGenericError } from "@/lib/utils";

type Error = AxiosError<ValidationErrorData<unknown>>;

interface Args {
  id: string;
  onSuccess: (data: PurchaseOrder) => void;
}

export function useReceiptPurchaseOrder({ id, onSuccess }: Args) {
  const queryClient = useQueryClient();

  return useMutation<PurchaseOrderAPI, Error, ReceiptPurchaseOrder>({
    mutationKey: ["purchase-order", id, "receipt"],
    mutationFn: (details: ReceiptPurchaseOrder) =>
      api
        .post(`/api/purchase-order/${id}/receipt`, details)
        .then((resp) => resp.data),
    onSuccess: (data) => {
      const purchaseOrder = transformPurchaseOrder(data);
      queryClient.setQueryData(["purchase-order", id], purchaseOrder);
      queryClient.invalidateQueries({
        queryKey: ["purchase-order", id, "lines"],
      });
      onSuccess(purchaseOrder);
    },
    onError: (e) => {
      if (e.response?.status === 400 && e.response?.data) {
        toast.error(e.response.data.message);
      } else {
        toastGenericError();
      }
    },
  });
}
