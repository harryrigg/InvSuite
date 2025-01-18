"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  InventoryItem,
  UpsertInventoryItem,
  upsertSchema,
} from "@/lib/types/inventory";

import { useFetchInventoryItem } from "@/hooks/queries/inventory/fetch";
import { useUpdateInventoryItem } from "@/hooks/queries/inventory/update";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { InternalHeader } from "@/components/internal-header";
import Loader from "@/components/loader";
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

export default function Load() {
  const id = useParams<{ id: string }>().id;

  const { data, isPending, isError } = useFetchInventoryItem({ id });

  if (isError) {
    notFound();
  } else if (isPending) {
    return <Loader />;
  } else {
    return <Page item={data} />;
  }
}

interface PageProps {
  item: InventoryItem;
}

function Page({ item }: PageProps) {
  const router = useRouter();
  const parentHref = `/dashboard/inventory/${item.id}`;

  const form = useForm<UpsertInventoryItem>({
    resolver: zodResolver(upsertSchema),
    defaultValues: {
      sku: item.sku,
      name: item.name,
      description: item.description ?? "",
    },
  });

  const { mutate } = useUpdateInventoryItem({
    id: item.id,
    form,
    onSuccess: () => {
      toast.success("Item updated");
      router.push(parentHref);
    },
  });

  const onSubmit = (values: UpsertInventoryItem) => {
    mutate(values);
  };

  return (
    <>
      <InternalHeader>
        <AppBreadcrumbs page="Edit" />
      </InternalHeader>
      <PageCard>
        <PageCardHeader title={item.name} subTitle="Edit Details" />
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
              <LinkButton variant="outline" size="sm" href={parentHref}>
                Cancel
              </LinkButton>
              <Button type="submit" size="sm">
                Update Item
              </Button>
            </PageCardFooter>
          </form>
        </Form>
      </PageCard>
    </>
  );
}
