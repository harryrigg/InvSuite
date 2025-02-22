import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/lib/api";
import { ValidationErrorData } from "@/lib/types/utils";
import { toastGenericError } from "@/lib/utils";

type Error = AxiosError<ValidationErrorData<unknown>>;

interface Args {
  purchaseOrderId: string;
}

export function useCancelPurchaseOrder({ purchaseOrderId }: Args) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error>({
    mutationKey: ["purchase-order", purchaseOrderId, "cancel"],
    mutationFn: () =>
      api
        .post(`/api/purchase-order/${purchaseOrderId}/cancel`)
        .then((resp) => resp.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchase-order", purchaseOrderId],
      });
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
