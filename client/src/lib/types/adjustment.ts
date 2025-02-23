import { z } from "zod";

export const adjusmentTypes = ["add", "subtract", "set"] as const;

const amountSchema = (min: number) => z.coerce.number().int().min(min);

const baseAdjustmentSchema = z.object({
  reason: z.string().min(1),
});

const addSubtractAdjustmentSchema = baseAdjustmentSchema.extend({
  type: z.enum(["add", "subtract"]),
  amount: amountSchema(1),
});

const setAdjustmentSchema = baseAdjustmentSchema.extend({
  type: z.literal("set"),
  amount: amountSchema(0),
});

export const adjustmentSchema = z.discriminatedUnion("type", [
  addSubtractAdjustmentSchema,
  setAdjustmentSchema,
]);

export type CreateAdjustment = z.infer<typeof adjustmentSchema>;

export type AdjustmentAPI = {
  id: string;
  created_at: string;
  inventory_item_id: string;
  source: AdjustmentSource;
  source_id: string | null;
  source_reference: string | null;
  type: AdjustmentType;
  amount: number;
  stock_count: number;
  reason: string | null;
};

export type AdjustmentSource = "manual" | "purchase_order" | "sales_order";
export type AdjustmentType = "add" | "subtract" | "set";

export type Adjustment = {
  id: string;
  created_at: Date;
  inventory_item_id: string;
  source: AdjustmentSource;
  source_id: string | null;
  source_reference: string | null;
  type: AdjustmentType;
  amount: number;
  stock_count: number;
  reason: string | null;
};

export function transformAdjustment(adjustment: AdjustmentAPI): Adjustment {
  return {
    ...adjustment,
    created_at: new Date(adjustment.created_at),
  };
}
