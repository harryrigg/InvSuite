"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { CreatePurchaseOrder, createSchema } from "@/lib/types/purchase-order";

import { useCreatePurchaseOrder } from "@/hooks/queries/purchase-order/create";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import TextField from "@/components/fields/text-field";
import { InternalHeader } from "@/components/internal-header";
import {
  PageCard,
  PageCardDivider,
  PageCardFooter,
  PageCardHeader,
} from "@/components/page-card";
import PurchaseOrderLineEditTable from "@/components/purchase-order/line-edit-table";
import { Button, LinkButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

export default function Page() {
  const router = useRouter();

  const form = useForm<CreatePurchaseOrder>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      reference: "",
      supplier: "",
      lines: [],
    },
  });

  const { mutate } = useCreatePurchaseOrder({
    form,
    onSuccess: (data) => {
      toast.success("Purchase order created");
      router.push(`/dashboard/purchase-order/${data.id}`);
    },
  });

  const onSubmit = (values: CreatePurchaseOrder) => {
    mutate(values);
  };

  return (
    <>
      <InternalHeader>
        <AppBreadcrumbs page="Create" />
      </InternalHeader>
      <PageCard>
        <PageCardHeader title="Create Purchase Order" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <TextField
                name="reference"
                label="Reference"
                description="Leave empty to auto-generate"
                placeholder="123456"
              />
              <TextField name="supplier" label="Supplier" />
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
              <LinkButton
                variant="outline"
                size="sm"
                href="/dashboard/inventory"
              >
                Cancel
              </LinkButton>
              <Button
                type="submit"
                size="sm"
                disabled={form.formState.isSubmitting}
              >
                Create
              </Button>
            </PageCardFooter>
          </form>
        </Form>
      </PageCard>
    </>
  );
}
