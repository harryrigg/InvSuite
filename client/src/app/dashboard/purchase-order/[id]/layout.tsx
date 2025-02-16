"use client";

import { useParams } from "next/navigation";
import { ReactNode } from "react";

import { useFetchPurchaseOrder } from "@/hooks/queries/purchase-order/fetch";

import { BreadcrumbNodeProvider } from "@/components/app-breadcrumbs";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const id = useParams<{ id: string }>().id;
  const { data } = useFetchPurchaseOrder({ id });

  return (
    <BreadcrumbNodeProvider
      name={data?.referenceFormatted() ?? "..."}
      route={id}
    >
      {children}
    </BreadcrumbNodeProvider>
  );
}
