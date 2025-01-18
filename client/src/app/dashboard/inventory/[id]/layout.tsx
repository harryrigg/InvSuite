"use client";

import { useParams } from "next/navigation";
import { ReactNode } from "react";

import { useFetchInventoryItem } from "@/hooks/queries/inventory/fetch";

import { BreadcrumbNodeProvider } from "@/components/app-breadcrumbs";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const id = useParams<{ id: string }>().id;
  const { data } = useFetchInventoryItem({ id });

  return (
    <BreadcrumbNodeProvider name={data?.sku ?? "..."} route={id}>
      {children}
    </BreadcrumbNodeProvider>
  );
}
