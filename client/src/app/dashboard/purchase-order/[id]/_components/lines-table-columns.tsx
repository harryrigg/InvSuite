import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

import { PurchaseOrder } from "@/lib/types/purchase-order";
import { PurchaseOrderLine } from "@/lib/types/purchase-order-line";
import { cn } from "@/lib/utils";

const helper = createColumnHelper<PurchaseOrderLine>();

export function createColumns(purchaseOrder: PurchaseOrder) {
  return [
    helper.accessor("item_sku", {
      header: "SKU",
      minSize: 120,
      cell: ({ row }) => (
        <Link
          href={`/dashboard/inventory/${row.original.item_id}`}
          className="underline"
        >
          {row.original.item_sku}
        </Link>
      ),
    }),
    helper.accessor("item_name", {
      header: "Name",
      size: 99999,
    }),
    helper.accessor("quantity", {
      header: "Ordered Quantity",
      cell: ({ getValue }) => (
        <span
          className={cn(purchaseOrder.hasBeenReceived() && "text-zinc-500")}
        >
          {getValue()}
        </span>
      ),
      minSize: 200,
    }),
    ...(purchaseOrder.hasBeenReceived()
      ? [
          helper.accessor("received_quantity", {
            header: "Received Quantity",
            minSize: 200,
          }),
        ]
      : []),
  ];
}
