"use client";

import { SquarePen } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PurchaseOrder } from "@/lib/types/purchase-order";

import { useDeletePurchaseOrder } from "@/hooks/queries/purchase-order/delete";
import { useFetchPurchaseOrder } from "@/hooks/queries/purchase-order/fetch";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import DeleteButton from "@/components/delete-button";
import {
  InternalHeader,
  InternalHeaderActions,
} from "@/components/internal-header";
import Loader from "@/components/loader";
import { PageCardContainer } from "@/components/page-card";
import { LinkButton } from "@/components/ui/button";

import DetailsSection from "./_components/details-section";
import LinesSection from "./_components/lines-section";

export default function Load() {
  const id = useParams<{ id: string }>().id;

  const { data, isPending, isError } = useFetchPurchaseOrder({ id });

  if (isError) {
    notFound();
  } else if (isPending) {
    return <Loader />;
  } else {
    return <Page purchaseOrder={data} />;
  }
}

interface PageProps {
  purchaseOrder: PurchaseOrder;
}

function Page({ purchaseOrder }: PageProps) {
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: mutateDelete, isPending: isDeletePending } =
    useDeletePurchaseOrder({
      id: purchaseOrder.id,
      onSuccess: () => {
        toast.success("Purchase Order deleted");
        setDeleteOpen(false);
        router.push("/dashboard/purchase-order");
      },
    });

  return (
    <>
      <InternalHeader>
        <AppBreadcrumbs />
        <InternalHeaderActions>
          <LinkButton
            size="xs"
            href={`/dashboard/purchase-order/${purchaseOrder.id}/edit`}
          >
            <SquarePen /> Edit Details
          </LinkButton>
          <DeleteButton
            open={deleteOpen}
            setOpen={setDeleteOpen}
            mutate={mutateDelete}
            isPending={isDeletePending}
            title="Delete Purchase Order"
          />
        </InternalHeaderActions>
      </InternalHeader>
      <PageCardContainer>
        <DetailsSection purchaseOrder={purchaseOrder} />
        <LinesSection purchaseOrder={purchaseOrder} />
      </PageCardContainer>
    </>
  );
}
