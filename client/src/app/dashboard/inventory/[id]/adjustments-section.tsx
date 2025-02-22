import {
  ColumnFiltersState,
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

import { useFetchInventoryItemAdjustmentList } from "@/hooks/queries/inventory/adjustment/fetch-list";

import { AdjustmentTypeBadge } from "@/components/adjustment";
import { FilterInput } from "@/components/filter-input";
import { PageCard, PageCardHeader } from "@/components/page-card";
import ColumnFilter, { FilterColumn } from "@/components/table/column-filter";
import { DataTable } from "@/components/table/data-table";
import { Pagination } from "@/components/table/pagination";
import { SortHeader } from "@/components/table/sort-header";
import { LinkButton } from "@/components/ui/button";

const columnHelper = createColumnHelper<Adjustment>();
const columns = [
  columnHelper.accessor("type", {
    header: "Type",
    cell: (v) => <AdjustmentTypeBadge type={v.getValue()} />,
    maxSize: 60,
    filterFn: "arrIncludesSome",
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

const filterColumns = [
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

interface Props {
  item: InventoryItem;
  query: ReturnType<typeof useFetchInventoryItemAdjustmentList>;
}

export default function AdjustmentsSection({ query, item }: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);

  const [globalFilter, setGlobalFilter] = useState("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
    onColumnFiltersChange: setColumnFilters,

    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,

    state: {
      sorting,
      globalFilter: globalFilter,
      columnFilters,
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
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9 md:max-w-96"
          />
          <ColumnFilter
            columns={filterColumns}
            state={columnFilters}
            setState={setColumnFilters}
          />

          <LinkButton
            size="sm"
            variant="outline"
            href={`/dashboard/inventory/${item.id}/adjustment/new`}
            className="ml-auto"
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
