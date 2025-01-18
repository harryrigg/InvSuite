import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";

interface Args {
  id: string;
}

export function useFetchInventoryItemImage({ id }: Args) {
  return useQuery({
    queryKey: ["inventory_item", id, "image"],
    queryFn: () =>
      api
        .get(`/api/inventory/${id}/image`, { responseType: "blob" })
        .then((resp) => URL.createObjectURL(resp.data))
        .catch((e) => {
          if (e.response?.status === 404) return null;
          throw e;
        }),
  });
}
