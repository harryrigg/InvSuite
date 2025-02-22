"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  PurchaseOrder,
  UpdatePurchaseOrder,
  updateSchema,
} from "@/lib/types/purchase-order";
import { PurchaseOrderLine } from "@/lib/types/purchase-order-line";

import { useFetchPurchaseOrder } from "@/hooks/queries/purchase-order/fetch";
import { useFetchPurchaseOrderLineList } from "@/hooks/queries/purchase-order/lines/fetch-list";
import { useUpdatePurchaseOrder } from "@/hooks/queries/purchase-order/update";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import TextField from "@/components/fields/text-field";
import { InternalHeader } from "@/components/internal-header";
import Loader from "@/components/loader";
import {
  PageCard,
  PageCardDivider,
  PageCardFooter,
  PageCardHeader,
} from "@/components/page-card";
import PurchaseOrderLineEditTable from "@/components/purchase-order/line-edit-table";
import { Button, LinkButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

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

  const form = useForm<UpdatePurchaseOrder>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      supplier: purchaseOrder.supplier,
      lines: defaultLines,
    },
  });

  const { mutate } = useUpdatePurchaseOrder({
    id: purchaseOrder.id,
    form,
    onSuccess: () => {
      toast.success("Purchase order updated");
      router.push(parentHref);
    },
  });

  const onSubmit = (values: UpdatePurchaseOrder) => {
    mutate(values);
  };

  return (
    <>
      <InternalHeader>
        <AppBreadcrumbs page="Edit" />
      </InternalHeader>
      <PageCard>
        <PageCardHeader
          title={purchaseOrder.referenceFormatted()}
          subTitle="Edit Details"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <TextField
                name="supplier"
                label="Supplier"
                placeholder="123456"
              />
            </div>
            <PageCardDivider />
            <Controller
              name="lines"
              control={form.control}
              render={({ field }) => (
                <PurchaseOrderLineEditTable
                  data={field.value}
                  onChange={field.onChange}
                />
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
                Update
              </Button>
            </PageCardFooter>
          </form>
        </Form>
      </PageCard>
    </>
  );
}
