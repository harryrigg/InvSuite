"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { CreatePurchaseOrder, createSchema } from "@/lib/types/purchase-order";

import { useCreatePurchaseOrder } from "@/hooks/queries/purchase-order/create";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { InternalHeader } from "@/components/internal-header";
import {
  PageCard,
  PageCardDivider,
  PageCardFooter,
  PageCardHeader,
} from "@/components/page-card";
import { Button, LinkButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import LineTable from "./_components/line-table";

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
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference</FormLabel>
                    <FormDescription>
                      Leave empty to auto-generate
                    </FormDescription>
                    <FormControl>
                      <FormInput type="text" placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <FormInput type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <PageCardDivider />
            <Controller
              name="lines"
              control={form.control}
              render={({ field }) => (
                <LineTable data={field.value} onChange={field.onChange} />
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
