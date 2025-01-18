"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { UpsertInventoryItem, upsertSchema } from "@/lib/types/inventory";

import { useCreateInventoryItem } from "@/hooks/queries/inventory/create";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { InternalHeader } from "@/components/internal-header";
import {
  PageCard,
  PageCardFooter,
  PageCardHeader,
} from "@/components/page-card";
import { Button, LinkButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Page() {
  const router = useRouter();

  const form = useForm<UpsertInventoryItem>({
    resolver: zodResolver(upsertSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
    },
  });

  const { mutate } = useCreateInventoryItem({
    form,
    onSuccess: (data) => {
      toast.success("Inventory item created");
      router.push(`/dashboard/inventory/${data.id}`);
    },
  });

  const onSubmit = (values: UpsertInventoryItem) => {
    mutate(values);
  };

  return (
    <>
      <InternalHeader>
        <AppBreadcrumbs page="Create" />
      </InternalHeader>
      <PageCard>
        <PageCardHeader title="Create Inventory Item" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <FormInput type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <FormInput type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <FormInput type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <PageCardFooter>
              <LinkButton
                variant="outline"
                size="sm"
                href="/dashboard/inventory"
              >
                Cancel
              </LinkButton>
              <Button type="submit" size="sm">
                Create Item
              </Button>
            </PageCardFooter>
          </form>
        </Form>
      </PageCard>
    </>
  );
}
