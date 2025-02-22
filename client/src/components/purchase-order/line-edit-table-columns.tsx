import { createColumnHelper } from "@tanstack/react-table";
import React from "react";

import { Option } from "@/lib/types/utils";

import { EditableTableActionCell } from "@/components/table/editable-action-cell";
import {
  EditableNumberCell,
  EditableSelectCell,
} from "@/components/table/editable-cells";

import { LineItem, lineItemSchema } from "./line-edit-table";

const helper = createColumnHelper<LineItem>();

export const createColumns = (itemSelectValues: Option[]) => {
  return [
    helper.accessor("item_id", {
      header: "Inventory Item",
      cell: (props) => (
        <EditableSelectCell
          inputPlaceholder="Search for Inventory Items"
          values={itemSelectValues}
          {...props}
        />
      ),
      size: 99999,
    }),
    helper.accessor("quantity", {
      header: "Quantity",
      cell: EditableNumberCell,
      minSize: 250,
    }),
    helper.display({
      id: "actions",
      cell: (props) => (
        <EditableTableActionCell {...props} schema={lineItemSchema} />
      ),
      minSize: 120,
    }),
  ];
};
