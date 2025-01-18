"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  CreateAdjustment,
  adjusmentTypes,
  adjustmentSchema,
} from "@/lib/types/adjustment";
import { InventoryItem } from "@/lib/types/inventory";
import { toTitleCase } from "@/lib/utils";

import { useCreateInventoryItemAdjustment } from "@/hooks/queries/inventory/adjustment/create";
import { useFetchInventoryItem } from "@/hooks/queries/inventory/fetch";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { InternalHeader } from "@/components/internal-header";
import Loader from "@/components/loader";
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
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Load() {
  const id = useParams<{ id: string }>().id;
  const { data, isPending, error } = useFetchInventoryItem({ id });

  if (error) {
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

  const form = useForm<CreateAdjustment>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      type: "add",
      amount: 0,
      reason: "",
    },
  });
  const [type, amount] = form.watch(["type", "amount"]);

  const { mutate } = useCreateInventoryItemAdjustment({
    inventoryItemId: item.id,
    form,
    onSuccess: () => {
      toast.success("Stock adjusted successfully");
      router.push(parentHref);
    },
  });

  const onSubmit = (values: CreateAdjustment) => {
    mutate(values);
  };

  const afterAdjustCount = useMemo(() => {
    const amountNo = Number(amount) || 0;
    if (type === "add") {
      return item.stock_count + amountNo;
    } else if (type === "subtract") {
      const result = item.stock_count - amountNo;
      return result < 0 ? null : result;
    } else {
      return amountNo;
    }
  }, [type, amount, item.stock_count]);

  return (
    <>
      <InternalHeader>
        <AppBreadcrumbs page="New Adjustment" />
      </InternalHeader>
      <PageCard>
        <PageCardHeader title={item.name} subTitle="Adjust Stock Level" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {adjusmentTypes.map((v) => (
                          <SelectItem key={v} value={v}>
                            {toTitleCase(v)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Amount</FormLabel>
                    <FormControl>
                      <FormInput type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Adjustment</FormLabel>
                    <FormControl>
                      <FormInput type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <PageCardDivider />
            <div className="flex gap-2">
              <CountCard title="Current Stock Level" count={item.stock_count} />
              <CountCard title="After Adjustment" count={afterAdjustCount} />
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

interface CountCardProps {
  title: string;
  count: number | null;
}

function CountCard({ title, count }: CountCardProps) {
  return (
    <div className="h-24 w-56 space-y-1 rounded border p-4 shadow">
      <h4 className="mt-1 text-gray-600">{title}</h4>
      {count === null ? (
        <p className="flex items-center gap-2 text-sm text-red-500">
          <TriangleAlert className="stroke-1.5 size-4" /> Cannot be negative
        </p>
      ) : (
        <p className="text-xl font-semibold">{count}</p>
      )}
    </div>
  );
}
