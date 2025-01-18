"use client";

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
import Link from "next/link";
import { useState } from "react";

import { InventoryItem } from "@/lib/types/inventory";

import { useFetchInventoryItemList } from "@/hooks/queries/inventory/fetch-list";

import { FilterInput } from "@/components/filter-input";
import { DataTable } from "@/components/table/data-table";
import { Pagination } from "@/components/table/pagination";
import { SortHeader } from "@/components/table/sort-header";
import { LinkButton } from "@/components/ui/button";

const columnHelper = createColumnHelper<InventoryItem>();

const columns = [
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
        dateFormat(value, "MMMM d, yyyy (p)")
      ) : (
        <span className="italic text-gray-500">N/A</span>
      );
    },
    minSize: 300,
  }),
];

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
