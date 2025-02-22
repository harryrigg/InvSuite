import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";

import { EditableTableMeta, EditingTableEntry } from "@/lib/types/table";

import { DataTable } from "@/components/table/data-table";

import { ReceiptLine } from "../page";
import { columns } from "./receipt-columns";

type LineEditEntry = EditingTableEntry<ReceiptLine>;

interface Props {
  data: ReceiptLine[];
  onChange: (value: ReceiptLine[]) => void;
}

export default function ReceiptTable({ data, onChange }: Props) {
  const [editingData, setEditingData] = useState<(LineEditEntry | null)[]>(
    Array(data.length).fill(null),
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
    } satisfies EditableTableMeta<ReceiptLine>,
  });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">Adjust Lines</h3>
      <DataTable table={table} />
    </div>
  );
}
