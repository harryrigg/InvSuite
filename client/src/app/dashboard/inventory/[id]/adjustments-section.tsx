import {
  PaginationState,
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format as dateFormat } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Adjustment } from "@/lib/types/adjustment";
import { InventoryItem } from "@/lib/types/inventory";
import { cn, toTitleCase } from "@/lib/utils";

import { useFetchInventoryItemAdjustmentList } from "@/hooks/queries/inventory/adjustment/fetch-list";

import { FilterInput } from "@/components/filter-input";
import { PageCard, PageCardHeader } from "@/components/page-card";
import { DataTable } from "@/components/table/data-table";
import { Pagination } from "@/components/table/pagination";
import { SortHeader } from "@/components/table/sort-header";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

const columnHelper = createColumnHelper<Adjustment>();
const columns = [
  columnHelper.accessor("type", {
    header: "Type",
    cell: (v) => <TypeBadge type={v.getValue()} />,
    maxSize: 60,
  }),
  columnHelper.accessor("created_at", {
    header: ({ column }) => <SortHeader title="Time" column={column} />,
    cell: (v) => dateFormat(v.getValue(), "MMMM d, yyyy (p)"),
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

interface Props {
  item: InventoryItem;
  query: ReturnType<typeof useFetchInventoryItemAdjustmentList>;
}

export default function AdjustmentsSection({ query, item }: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [filter, setFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const table = useReactTable({
    data: query.data ?? [],
    columns,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter: filter,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageCard>
      <PageCardHeader title="Adjustments" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col-reverse gap-2 md:flex-row">
          <FilterInput
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mr-auto h-9 md:max-w-96"
          />

          <LinkButton
            size="sm"
            variant="outline"
            href={`/dashboard/inventory/${item.id}/adjustment/new`}
          >
            <Plus /> New Adjustment
          </LinkButton>
        </div>
        <DataTable table={table} className="border-gray-300" />
        <Pagination state={pagination} table={table} />
      </div>
    </PageCard>
  );
}

interface TypeBadgeProps {
  type: Adjustment["type"];
}

function TypeBadge({ type }: TypeBadgeProps) {
  const variants = {
    add: "status-positive",
    subtract: "status-negative",
    set: "status-neutral",
  } as const;

  return (
    <Badge variant={variants[type]} className="gap-1.5">
      <span
        className={cn(
          "size-1 rounded-full",
          type === "add" && "bg-green-600",
          type === "subtract" && "bg-red-600",
          type === "set" && "bg-gray-600",
        )}
      />
      {toTitleCase(type)}
    </Badge>
  );
}
