import { z } from "zod";

export const createSchema = z.object({
  reference: z
    .string()
    .regex(/^\s*$/)
    .or(
      z
        .string()
        .regex(/^[A-Za-z]\S*$/, "Custom references must start with a letter")
        .max(16),
    ),
  supplier: z.string().min(1).max(255),
});

export type CreatePurchaseOrder = z.infer<typeof createSchema>;

export type PurchaseOrderAPI = {
  id: string;
  reference: string;
  supplier: string;
  fulfilled_at: string | null;
  created_at: string;
};

export class PurchaseOrder {
  constructor(
    readonly id: string,
    readonly reference: string,
    readonly supplier: string,
    readonly fulfilled_at: Date | null,
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
    item.fulfilled_at ? new Date(item.fulfilled_at) : null,
    new Date(item.created_at),
  );
}
