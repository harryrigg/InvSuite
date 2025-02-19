import { createColumnHelper } from "@tanstack/react-table";

import { PurchaseOrderLine } from "@/lib/types/purchase-order-line";

const helper = createColumnHelper<PurchaseOrderLine>();

export const columns = [
  helper.accessor("item_sku", {
    header: "SKU",
    minSize: 120,
  }),
  helper.accessor("item_name", {
    header: "Name",
    size: 99999,
  }),
  helper.accessor("quantity", {
    header: "Quantity",
    minSize: 200,
  }),
];
