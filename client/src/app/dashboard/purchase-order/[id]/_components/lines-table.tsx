import {
  PaginationState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { PurchaseOrder } from "@/lib/types/purchase-order";

import { useFetchPurchaseOrderLineList } from "@/hooks/queries/purchase-order/lines/fetch-list";

import { DataTable } from "@/components/table/data-table";
import { Pagination } from "@/components/table/pagination";

import { columns } from "./lines-table-columns";

interface Props {
  purchaseOrder: PurchaseOrder;
}

export default function LinesTable({ purchaseOrder }: Props) {
  const { data } = useFetchPurchaseOrderLineList({
    purchaseOrderId: purchaseOrder.id,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const table = useReactTable({
    columns,
    data: data ?? [],

    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,

    state: {
      pagination,
    },

    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <DataTable table={table} />
      <Pagination table={table} state={pagination} />
    </div>
  );
}
