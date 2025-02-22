"use client";

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
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PurchaseOrder } from "@/lib/types/purchase-order";
import { formatDateUsersTimezone } from "@/lib/utils";

import { useFetchPurchaseOrderList } from "@/hooks/queries/purchase-order/fetch-list";

import { FilterInput } from "@/components/filter-input";
import { PurchaseOrderStatusBadge } from "@/components/purchase-order";
import ColumnFilter, { FilterColumn } from "@/components/table/column-filter";
import { DataTable } from "@/components/table/data-table";
import { Pagination } from "@/components/table/pagination";
import { SortHeader } from "@/components/table/sort-header";
import { LinkButton } from "@/components/ui/button";

const columnHelper = createColumnHelper<PurchaseOrder>();

const columns = [
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
    cell: ({ getValue }) => formatDateUsersTimezone(getValue()),
    minSize: 180,
  }),
];

const filterColumns = [
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
