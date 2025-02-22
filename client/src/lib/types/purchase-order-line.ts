export type PurchaseOrderLineAPI = {
  id: string;
  purchase_order_id: string;
  item_id: string;
  item_sku: string;
  item_name: string;
  quantity: number;
  received_quantity?: number;
};

export class PurchaseOrderLine {
  constructor(
    readonly id: string,
    readonly purchase_order_id: string,
    readonly item_id: string,
    readonly item_sku: string,
    readonly item_name: string,
    readonly quantity: number,
    readonly received_quantity?: number,
  ) {}
}

export function transformPurchaseOrderLine(
  item: PurchaseOrderLineAPI,
): PurchaseOrderLine {
  return new PurchaseOrderLine(
    item.id,
    item.purchase_order_id,
    item.item_id,
    item.item_sku,
    item.item_name,
    item.quantity,
    item.received_quantity,
  );
}
