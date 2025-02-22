import { PurchaseOrderStatus } from "@/lib/types/purchase-order";
import { toTitleCase } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

interface PurchaseOrderStatusBadgeProps {
  status: PurchaseOrderStatus;
  bubble?: boolean;
}

export function PurchaseOrderStatusBadge({
  status,
  bubble = true,
}: PurchaseOrderStatusBadgeProps) {
  const variants = {
    draft: "draft",
    ordered: "secondary",
    received: "positive",
    cancelled: "negative",
  } as const;

  return (
    <Badge variant={variants[status]} bubble={bubble}>
      {toTitleCase(status)}
    </Badge>
  );
}
