import { PurchaseOrder } from "@/lib/types/purchase-order";

import { PageCard, PageCardHeader } from "@/components/page-card";

import LinesTable from "./lines-table";

interface Props {
  purchaseOrder: PurchaseOrder;
}

export default function LinesSection({ purchaseOrder }: Props) {
  return (
    <PageCard>
      <PageCardHeader title="Lines" />
      <LinesTable purchaseOrder={purchaseOrder} />
    </PageCard>
  );
}
