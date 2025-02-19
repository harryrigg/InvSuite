import { PurchaseOrderStatus } from "@/lib/types/purchase-order";
import { toTitleCase } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

interface PurchaseOrderStatusBadgeProps {
  status: PurchaseOrderStatus;
}

export function PurchaseOrderStatusBadge({
  status,
}: PurchaseOrderStatusBadgeProps) {
  const variants = {
    draft: "draft",
    ordered: "secondary",
    received: "positive",
    cancelled: "negative",
  } as const;

  return (
    <Badge variant={variants[status]} bubble>
      {toTitleCase(status)}
    </Badge>
  );
}
