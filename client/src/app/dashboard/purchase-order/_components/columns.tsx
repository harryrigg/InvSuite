import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";

import { PurchaseOrder } from "@/lib/types/purchase-order";
import { formatDateLong } from "@/lib/utils";

import { PurchaseOrderStatusBadge } from "@/components/purchase-order";
import { FilterColumn } from "@/components/table/column-filter";
import { SortHeader } from "@/components/table/sort-header";

const columnHelper = createColumnHelper<PurchaseOrder>();

export const columns = [
  columnHelper.accessor("reference", {
    header: "Reference",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/purchase-order/${row.original.id}`}
        className="underline"
      >
        {row.original.referenceFormatted()}
      </Link>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <PurchaseOrderStatusBadge status={getValue()} />,
    filterFn: "arrIncludesSome",
  }),
  columnHelper.accessor("supplier", {
    header: ({ column }) => <SortHeader title="Supplier" column={column} />,
    size: 99999,
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => <SortHeader title="Created Time" column={column} />,
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{formatDateLong(getValue())}</span>
    ),
  }),
];

export const filterColumns = [
  {
    label: "Status",
    id: "status",
    type: "select",
    options: [
      {
        label: <PurchaseOrderStatusBadge status="draft" bubble={false} />,
        value: "draft",
      },
      {
        label: <PurchaseOrderStatusBadge status="ordered" bubble={false} />,
        value: "ordered",
      },
      {
        label: <PurchaseOrderStatusBadge status="received" bubble={false} />,
        value: "received",
      },
      {
        label: <PurchaseOrderStatusBadge status="cancelled" bubble={false} />,
        value: "cancelled",
      },
    ],
  },
] satisfies FilterColumn[];
