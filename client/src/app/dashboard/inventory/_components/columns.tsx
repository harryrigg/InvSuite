import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

import { InventoryItem } from "@/lib/types/inventory";
import { formatDateLong } from "@/lib/utils";

import { SortHeader } from "@/components/table/sort-header";

const columnHelper = createColumnHelper<InventoryItem>();

export const columns = [
  columnHelper.accessor("sku", {
    header: "SKU",
    minSize: 80,
    maxSize: 80,
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => <SortHeader title="Name" column={column} />,
    cell: (v) => (
      <Link
        href={`/dashboard/inventory/${v.row.original.id}`}
        className="underline"
      >
        {v.getValue()}
      </Link>
    ),
    size: 99999,
  }),
  columnHelper.accessor("stock_count", {
    header: ({ column }) => <SortHeader title="Stock Count" column={column} />,
    minSize: 150,
  }),
  columnHelper.accessor("latest_adjustment_date", {
    header: ({ column }) => (
      <SortHeader title="Last Adjusted" column={column} />
    ),
    cell: (v) => {
      const value = v.getValue();
      return value ? (
        formatDateLong(value)
      ) : (
        <span className="italic text-gray-500">N/A</span>
      );
    },
    minSize: 300,
  }),
];
