import { PurchaseOrder } from "@/lib/types/purchase-order";

import { Detail, DetailColumn, DetailRow } from "@/components/detail";
import { PageCard, PageCardHeader } from "@/components/page-card";

interface Props {
  purchaseOrder: PurchaseOrder;
}

export default function DetailsSection({ purchaseOrder }: Props) {
  return (
    <PageCard>
      <PageCardHeader
        title={purchaseOrder.referenceFormatted()}
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
