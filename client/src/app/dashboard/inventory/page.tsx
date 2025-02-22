"use client";

import {
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

import { useFetchInventoryItemList } from "@/hooks/queries/inventory/fetch-list";

import { FilterInput } from "@/components/filter-input";
import { DataTable } from "@/components/table/data-table";
import { Pagination } from "@/components/table/pagination";
import { LinkButton } from "@/components/ui/button";

import { columns } from "./_components/columns";

export default function Page() {
  const { data } = useFetchInventoryItemList();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [filter, setFilter] = useState("");
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
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      globalFilter: filter,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <FilterInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 max-w-96"
        />
        <LinkButton size="sm" href="/dashboard/inventory/create">
          <Plus /> Create New Item
        </LinkButton>
      </div>
      <DataTable table={table} className="shadow" />
      <Pagination table={table} state={pagination} />
    </div>
  );
}
