import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";

import { InventoryItem } from "@/lib/types/inventory";

import { useFetchInventoryItemAdjustmentList } from "@/hooks/queries/inventory/adjustment/fetch-list";

import { FilterInput } from "@/components/filter-input";
import { PageCard, PageCardHeader } from "@/components/page-card";
import ColumnFilter from "@/components/table/column-filter";
import { DataTable } from "@/components/table/data-table";
import { Pagination } from "@/components/table/pagination";
import { LinkButton } from "@/components/ui/button";

import { columns, filterColumns } from "./adjustment-columns";

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
