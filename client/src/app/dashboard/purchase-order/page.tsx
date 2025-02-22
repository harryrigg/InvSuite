"use client";

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

import { useFetchPurchaseOrderList } from "@/hooks/queries/purchase-order/fetch-list";

import { FilterInput } from "@/components/filter-input";
import ColumnFilter from "@/components/table/column-filter";
import { DataTable } from "@/components/table/data-table";
import { Pagination } from "@/components/table/pagination";
import { LinkButton } from "@/components/ui/button";

import { columns, filterColumns } from "./_components/columns";

export default function Page() {
  const { data } = useFetchPurchaseOrderList();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "supplier", desc: false },
  ]);

  const [globalFilter, setGlobalFilter] = useState("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "status",
      value: ["draft", "ordered", "received"],
    },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,

    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,

    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      columnFilters,
      globalFilter,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <FilterInput
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-9 max-w-96"
        />
        <ColumnFilter
          columns={filterColumns}
          state={columnFilters}
          setState={setColumnFilters}
        />
        <LinkButton
          size="sm"
          href="/dashboard/purchase-order/create"
          className="ml-auto"
        >
          <Plus /> New Purchase Order
        </LinkButton>
      </div>
      <DataTable table={table} className="shadow" />
      <Pagination table={table} state={pagination} />
    </div>
  );
}
