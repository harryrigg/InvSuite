import { z } from "zod";

export const updateSchema = z.object({
  supplier: z.string().min(1).max(255),
  lines: z
    .array(
      z.object({
        item_id: z.string(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});

export const createSchema = updateSchema.extend({
  reference: z
    .string()
    .regex(/^\s*$/)
    .or(
      z
        .string()
        .regex(/^[A-Za-z]\S*$/, "Custom references must start with a letter")
        .max(16),
    ),
});

export type CreatePurchaseOrder = z.infer<typeof createSchema>;
export type UpdatePurchaseOrder = z.infer<typeof updateSchema>;

export type PurchaseOrderAPI = {
  id: string;
  reference: string;
  supplier: string;

  ordered_at: string | null;
  received_at: string | null;
  cancelled_at: string | null;
  status: PurchaseOrderStatus;

  created_at: string;
};

export type PurchaseOrderStatus =
  | "draft"
  | "ordered"
  | "received"
  | "cancelled";

export class PurchaseOrder {
  constructor(
    readonly id: string,

    readonly reference: string,
    readonly supplier: string,

    readonly ordered_at: Date | null,
    readonly received_at: Date | null,
    readonly cancelled_at: Date | null,
    readonly status: PurchaseOrderStatus,

    readonly created_at: Date,
  ) {}

  public referenceFormatted(): string {
    return `PO-${this.reference}`;
  }
}

export function transformPurchaseOrder(item: PurchaseOrderAPI): PurchaseOrder {
  return new PurchaseOrder(
    item.id,

    item.reference,
    item.supplier,

    item.ordered_at ? new Date(item.ordered_at) : null,
    item.received_at ? new Date(item.received_at) : null,
    item.cancelled_at ? new Date(item.cancelled_at) : null,

    item.status,

    new Date(item.created_at),
  );
}
