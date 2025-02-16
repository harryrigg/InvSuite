import { ReactNode } from "react";

import { BreadcrumbNodeProvider } from "@/components/app-breadcrumbs";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <BreadcrumbNodeProvider name="Purchase Orders" route="purchase-order">
      {children}
    </BreadcrumbNodeProvider>
  );
}
