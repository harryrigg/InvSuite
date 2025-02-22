import { AdjustmentType } from "@/lib/types/adjustment";
import { toTitleCase } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

interface AdjustmentTypeBadgeProps {
  type: AdjustmentType;
  bubble?: boolean;
}

export function AdjustmentTypeBadge({
  type,
  bubble = true,
}: AdjustmentTypeBadgeProps) {
  const variants = {
    add: "positive",
    subtract: "negative",
    set: "neutral",
  } as const;

  return (
    <Badge variant={variants[type]} bubble={bubble}>
      {toTitleCase(type)}
    </Badge>
  );
}
