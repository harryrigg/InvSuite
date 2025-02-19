import { PurchaseOrder } from "@/lib/types/purchase-order";

import { Detail, DetailColumn, DetailRow } from "@/components/detail";
import { PageCard, PageCardHeader } from "@/components/page-card";
import { PurchaseOrderStatusBadge } from "@/components/purchase-order";

interface Props {
  purchaseOrder: PurchaseOrder;
}

export default function DetailsSection({ purchaseOrder }: Props) {
  return (
    <PageCard>
      <PageCardHeader
        title={
          <span className="flex gap-2 items-center my-1">
            <PurchaseOrderStatusBadge status={purchaseOrder.status} />
            {purchaseOrder.referenceFormatted()}
          </span>
        }
        subTitle={purchaseOrder.supplier}
      />
      <div className="flex flex-col-reverse gap-4 lg:flex-row">
        <DetailColumn className="flex-1">
          <DetailRow>
            <Detail label="Reference">
              {purchaseOrder.referenceFormatted()}
            </Detail>
            <Detail label="Supplier Name">{purchaseOrder.supplier}</Detail>
          </DetailRow>
        </DetailColumn>
      </div>
    </PageCard>
  );
}
