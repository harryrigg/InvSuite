"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { PurchaseOrder } from "@/lib/types/purchase-order";
import { PurchaseOrderLine } from "@/lib/types/purchase-order-line";

import { useFetchPurchaseOrder } from "@/hooks/queries/purchase-order/fetch";
import { useFetchPurchaseOrderLineList } from "@/hooks/queries/purchase-order/lines/fetch-list";
import { useReceiptPurchaseOrder } from "@/hooks/queries/purchase-order/receipt";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { InternalHeader } from "@/components/internal-header";
import Loader from "@/components/loader";
import {
  PageCard,
  PageCardFooter,
  PageCardHeader,
} from "@/components/page-card";
import { PurchaseOrderStatusBadge } from "@/components/purchase-order/status-badge";
import { Button, LinkButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import ReceiptTable from "./_components/receipt-table";

export type ReceiptLine = {
  item_id: string;
  item_sku: string;
  item_name: string;
  original_quantity: number;
  quantity: number;
};

interface FormValues {
  lines: ReceiptLine[];
}

export default function Load() {
  const id = useParams<{ id: string }>().id;

  const {
    data: purchaseOrder,
    isPending: purchaseOrderPending,
    isError: purchaseOrderError,
  } = useFetchPurchaseOrder({ id });
  const {
    data: lines,
    isPending: linesPending,
    isError: linesError,
  } = useFetchPurchaseOrderLineList({ purchaseOrderId: id });

  if (purchaseOrderError || linesError) {
    notFound();
  } else if (purchaseOrderPending || linesPending) {
    return <Loader />;
  } else if (purchaseOrder.status !== "ordered") {
    return notFound();
  } else {
    return <Page purchaseOrder={purchaseOrder} lines={lines} />;
  }
}

interface PageProps {
  purchaseOrder: PurchaseOrder;
  lines: PurchaseOrderLine[];
}

function Page({ purchaseOrder, lines }: PageProps) {
  const router = useRouter();
  const parentHref = `/dashboard/purchase-order/${purchaseOrder.id}`;

  const defaultLines = useMemo(
    () =>
      lines.map((line) => ({
        item_id: line.item_id,
        quantity: line.quantity,
      })),
    [lines],
  );

  const form = useForm<FormValues>({
    defaultValues: {
      lines: defaultLines,
    },
  });

  const { mutate } = useReceiptPurchaseOrder({
    id: purchaseOrder.id,
    onSuccess: () => {
      toast.success("Purchase order receipted and marked as received");
      router.push(parentHref);
    },
  });

  const receiptInputLines = form.watch("lines");
  const receiptLines = useMemo(
    () =>
      receiptInputLines.map((v, idx) => ({
        ...v,
        item_name: lines[idx].item_name,
        item_sku: lines[idx].item_sku,
        original_quantity: lines[idx].quantity,
      })),
    [receiptInputLines],
  );

  const onSubmit = (values: FormValues) => {
    const adjustedLines = values.lines
      .map((v, idx) => ({ idx, ...v }))
      .filter((v) => v.quantity !== lines[v.idx].quantity)
      .map((v) => ({ index: v.idx, quantity: v.quantity }));

    mutate({ adjusted_lines: adjustedLines });
  };

  return (
    <>
      <InternalHeader>
        <AppBreadcrumbs page="Receipt In" />
      </InternalHeader>
      <PageCard>
        <PageCardHeader
          title="Receipt Purchase Order"
          subTitle={
            <span className="flex items-center gap-2 mt-1">
              {purchaseOrder.referenceFormatted()}
              <PurchaseOrderStatusBadge status={purchaseOrder.status} />
            </span>
          }
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="lines"
              control={form.control}
              render={({ field }) => (
                <ReceiptTable data={receiptLines} onChange={field.onChange} />
              )}
            />
            <PageCardFooter>
              <LinkButton variant="outline" size="sm" href={parentHref}>
                Cancel
              </LinkButton>
              <Button
                type="submit"
                size="sm"
                disabled={form.formState.isSubmitting}
              >
                Receipt In
              </Button>
            </PageCardFooter>
          </form>
        </Form>
      </PageCard>
    </>
  );
}
