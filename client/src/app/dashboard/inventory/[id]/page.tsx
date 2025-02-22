"use client";

import { SquarePen } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { InventoryItem } from "@/lib/types/inventory";

import { useFetchInventoryItemAdjustmentList } from "@/hooks/queries/inventory/adjustment/fetch-list";
import { useDeleteInventoryItem } from "@/hooks/queries/inventory/delete";
import { useFetchInventoryItem } from "@/hooks/queries/inventory/fetch";
import { useFetchInventoryItemImage } from "@/hooks/queries/inventory/fetch-image";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import DeleteButton from "@/components/delete-button";
import {
  InternalHeader,
  InternalHeaderActions,
} from "@/components/internal-header";
import Loader from "@/components/loader";
import { PageCardContainer } from "@/components/page-card";
import { LinkButton } from "@/components/ui/button";

import AdjustmentsSection from "./_components/adjustments-section";
import DetailsSection from "./_components/details-section";

export default function Load() {
  const id = useParams<{ id: string }>().id;

  const { data, isPending, isError } = useFetchInventoryItem({ id });
  const adjustmentQuery = useFetchInventoryItemAdjustmentList({ id });
  const imageQuery = useFetchInventoryItemImage({ id });

  if (isError) {
    notFound();
  } else if (isPending) {
    return <Loader />;
  } else {
    return (
      <Page
        item={data}
        imageQuery={imageQuery}
        adjustmentsQuery={adjustmentQuery}
      />
    );
  }
}

interface PageProps {
  item: InventoryItem;
  imageQuery: ReturnType<typeof useFetchInventoryItemImage>;
  adjustmentsQuery: ReturnType<typeof useFetchInventoryItemAdjustmentList>;
}

function Page({ item, imageQuery, adjustmentsQuery }: PageProps) {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeleteInventoryItem({
      id: item.id,
      onSuccess: () => {
        toast.success("Item deleted");
        setDeleteOpen(false);
        router.push("/dashboard/inventory");
      },
    });

  return (
    <>
      <InternalHeader>
        <AppBreadcrumbs />
        <InternalHeaderActions>
          <LinkButton size="xs" href={`/dashboard/inventory/${item.id}/edit`}>
            <SquarePen /> Edit Details
          </LinkButton>
          <DeleteButton
            open={deleteOpen}
            setOpen={setDeleteOpen}
            mutate={mutateDelete}
            isPending={isDeletePending}
            title="Delete Inventory Item"
          />
        </InternalHeaderActions>
      </InternalHeader>
      <PageCardContainer>
        <DetailsSection item={item} imageQuery={imageQuery} />
        <AdjustmentsSection item={item} query={adjustmentsQuery} />
      </PageCardContainer>
    </>
  );
}
