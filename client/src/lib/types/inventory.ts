import { z } from "zod";

export const upsertSchema = z.object({
  sku: z.string().min(1).max(6),
  name: z.string().min(1),
  description: z.string(),
});

export type UpsertInventoryItem = z.infer<typeof upsertSchema>;

export type InventoryItemAPI = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  stock_count: number;
  latest_adjustment_date: string | null;
};

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  stock_count: number;
  latest_adjustment_date: Date | null;
};

export function transformInventoryItem(item: InventoryItemAPI): InventoryItem {
  return {
    ...item,
    latest_adjustment_date: item.latest_adjustment_date
      ? new Date(item.latest_adjustment_date)
      : null,
  };
}
