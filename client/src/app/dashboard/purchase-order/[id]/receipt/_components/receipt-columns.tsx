import { createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";

import { EditableTableActionCell } from "@/components/table/editable-action-cell";
import { EditableNumberCell } from "@/components/table/editable-cells";

import { ReceiptLine } from "../page";

const receiptLineSchema = z.object({
  quantity: z.number().int().min(0),
});

const helper = createColumnHelper<ReceiptLine>();

export const columns = [
  helper.accessor("item_sku", {
    header: "SKU",
    minSize: 120,
  }),
  helper.accessor("item_name", {
    header: "Name",
    size: 99999,
  }),
  helper.accessor("original_quantity", {
    header: "Ordered",
    minSize: 130,
  }),
  helper.accessor("quantity", {
    header: "Received",
    cell: EditableNumberCell,
    minSize: 130,
  }),
  helper.display({
    id: "actions",
    cell: (props) => (
      <EditableTableActionCell
        {...props}
        schema={receiptLineSchema}
        allowDelete={false}
      />
    ),
    minSize: 120,
  }),
];
