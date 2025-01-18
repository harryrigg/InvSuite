"use client";

import { SquarePen, Trash2, TriangleAlert } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { InventoryItem } from "@/lib/types/inventory";

import { useFetchInventoryItemAdjustmentList } from "@/hooks/queries/inventory/adjustment/fetch-list";
import { useDeleteInventoryItem } from "@/hooks/queries/inventory/delete";
import { useFetchInventoryItem } from "@/hooks/queries/inventory/fetch";
import { useFetchInventoryItemImage } from "@/hooks/queries/inventory/fetch-image";

import Alert from "@/components/alert";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import {
  InternalHeader,
  InternalHeaderActions,
} from "@/components/internal-header";
import Loader from "@/components/loader";
import { PageCardContainer } from "@/components/page-card";
import { Button, LinkButton } from "@/components/ui/button";

import AdjustmentsSection from "./adjustments-section";
import DetailsSection from "./details-section";

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
          <Alert
            open={deleteOpen}
            setOpen={setDeleteOpen}
            title="Delete Inventory Item"
            description={
              <span className="flex items-center gap-2">
                <TriangleAlert size={18} /> This cannot be undone
              </span>
            }
            confirm={
              <Button onClick={() => mutateDelete()} disabled={isDeletePending}>
                Delete Inventory Item
              </Button>
            }
          >
            <Button
              size="xs"
              variant="outline"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 /> Delete
            </Button>
          </Alert>
        </InternalHeaderActions>
      </InternalHeader>
      <PageCardContainer>
        <DetailsSection item={item} imageQuery={imageQuery} />
        <AdjustmentsSection item={item} query={adjustmentsQuery} />
      </PageCardContainer>
    </>
  );
}
