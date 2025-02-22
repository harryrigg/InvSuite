import { createColumnHelper } from "@tanstack/react-table";

import { Adjustment } from "@/lib/types/adjustment";
import { formatDateLong } from "@/lib/utils";

import { AdjustmentTypeBadge } from "@/components/adjustment";
import { FilterColumn } from "@/components/table/column-filter";
import { SortHeader } from "@/components/table/sort-header";

const columnHelper = createColumnHelper<Adjustment>();

export const columns = [
  columnHelper.accessor("type", {
    header: "Type",
    cell: (v) => <AdjustmentTypeBadge type={v.getValue()} />,
    maxSize: 60,
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => <SortHeader title="Time" column={column} />,
    cell: (v) => formatDateLong(v.getValue()),
    sortingFn: (rowA, rowB) => {
      return Number(rowA.original.id) - Number(rowB.original.id);
    },
    maxSize: 100,
  }),
  columnHelper.accessor("amount", {
    header: ({ column }) => <SortHeader title="Amount" column={column} />,
    cell: (v) => <p>{v.getValue()}</p>,
    maxSize: 80,
  }),
  columnHelper.accessor("stock_count", {
    header: "Updated Quantity",
    cell: (v) => <p>{v.getValue()}</p>,
    maxSize: 80,
  }),
  columnHelper.accessor("reason", {
    header: "Reason",
    cell: (v) => (
      <p className="truncate italic text-gray-700">{v.getValue()}</p>
    ),
    maxSize: 120,
  }),
];

export const filterColumns = [
  {
    id: "type",
    label: "Type",
    type: "select",
    options: [
      {
        label: <AdjustmentTypeBadge type="add" bubble={false} />,
        value: "add",
      },
      {
        label: <AdjustmentTypeBadge type="subtract" bubble={false} />,
        value: "subtract",
      },
      {
        label: <AdjustmentTypeBadge type="set" bubble={false} />,
        value: "set",
      },
    ],
  },
] satisfies FilterColumn[];
