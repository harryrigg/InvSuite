import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import { AdjustmentSource, AdjustmentType } from "@/lib/types/adjustment";
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

const sourceBadgeVariants = {
  manual: "neutral",
  purchase_order: "secondary",
  sales_order: "positive",
} as const;

interface AdjustmentSourceLinkBadgeProps {
  source: AdjustmentSource;
  sourceableId: string | null;
  sourceableReference: string | null;
  bubble?: boolean;
}

export function AdjustmentSourceLinkBadge({
  source,
  sourceableId,
  sourceableReference,
  bubble = false,
}: AdjustmentSourceLinkBadgeProps) {
  if (source !== "manual") {
    const route = source.replace("_", "-");
    return (
      <Link href={`/dashboard/${route}/${sourceableId}`} target="_blank">
        <Badge variant={sourceBadgeVariants[source]} bubble={bubble}>
          {source === "purchase_order" && `PO-${sourceableReference}`}
          {source === "sales_order" && `SO-${sourceableReference}`}
          <ExternalLinkIcon className="size-3" />
        </Badge>
      </Link>
    );
  }
  return <AdjustmentSourceBadge source="manual" bubble={bubble} />;
}

interface AdjustmentSourceBadgeProps {
  source: AdjustmentSource;
  bubble?: boolean;
}

export function AdjustmentSourceBadge({
  source,
  bubble,
}: AdjustmentSourceBadgeProps) {
  const labels = {
    manual: "Manual",
    purchase_order: "Purchase Order",
    sales_order: "Sales Order",
  };

  return (
    <Badge variant={sourceBadgeVariants[source]} bubble={bubble}>
      {labels[source]}
    </Badge>
  );
}
