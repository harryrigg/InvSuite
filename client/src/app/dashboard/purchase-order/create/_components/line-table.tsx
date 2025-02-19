"use client";

import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { EditableTableMeta, EditingTableEntry } from "@/lib/types/table";

import { useFetchInventoryItemList } from "@/hooks/queries/inventory/fetch-list";

import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";

import { createColumns } from "./line-table-columns";

export const lineItemSchema = z.object({
  item_id: z.string().trim().nonempty("Item is required"),
  quantity: z
    .number()
    .int("Must be a whole number")
    .min(1, "Quantity must be at least 1"),
});

export type LineItem = z.infer<typeof lineItemSchema>;
type LineItemEditEntry = EditingTableEntry<LineItem>;

interface Props {
  data: LineItem[];
  onChange: (value: LineItem[]) => void;
}

export default function LineTable({ data, onChange }: Props) {
  const [editingData, setEditingData] = useState<(LineItemEditEntry | null)[]>(
    [],
  );

  const { data: inventoryItems } = useFetchInventoryItemList();
  const itemSelectValues = useMemo(
    () =>
      inventoryItems
        ? inventoryItems.map((v) => ({
            label: `${v.name} (${v.sku})`,
            value: v.id,
          }))
        : [],
    [inventoryItems],
  );

  const columns = useMemo(
    () => createColumns(itemSelectValues),
    [itemSelectValues],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    meta: {
      data,
      setData: onChange,
      editingData,
      setEditingData,
    } satisfies EditableTableMeta<LineItem>,
  });

  const addItem = () => {
    const newItem = { item_id: "", quantity: 0 };
    onChange([...data, newItem]);
    setEditingData((prev) => [
      ...prev,
      { data: newItem, errors: [], saved: false },
    ]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Purchase Items</h3>
        <Button onClick={addItem} size="sm" variant="outline" type="button">
          <PlusIcon /> Add Line Item
        </Button>
      </div>
      <DataTable table={table} noResults="No lines" />
    </div>
  );
}
