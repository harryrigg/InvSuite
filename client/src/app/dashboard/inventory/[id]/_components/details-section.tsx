import { InventoryItem } from "@/lib/types/inventory";

import { useFetchInventoryItemImage } from "@/hooks/queries/inventory/fetch-image";

import { Detail, DetailColumn, DetailRow } from "@/components/detail";
import { PageCard, PageCardHeader } from "@/components/page-card";

import { ItemImage } from "./item-image";

interface Props {
  item: InventoryItem;
  imageQuery: ReturnType<typeof useFetchInventoryItemImage>;
}

export default function DetailsSection({ item, imageQuery }: Props) {
  return (
    <PageCard>
      <PageCardHeader title={item.name} subTitle={item.sku} />
      <div className="flex flex-col-reverse gap-4 lg:flex-row">
        <ItemImage query={imageQuery} item={item} />
        <DetailColumn className="flex-1">
          <DetailRow>
            <Detail label="SKU">{item.sku}</Detail>
            <Detail label="Current Stock Count">{item.stock_count}</Detail>
          </DetailRow>
          <Detail label="Name">{item.name}</Detail>
          <Detail label="Description">{item.description}</Detail>
        </DetailColumn>
      </div>
    </PageCard>
  );
}
