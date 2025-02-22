import {
  BanIcon,
  CircleCheckBig,
  LucideIcon,
  PackageCheckIcon,
} from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { toast } from "sonner";

import { PurchaseOrder } from "@/lib/types/purchase-order";

import { useCancelPurchaseOrder } from "@/hooks/queries/purchase-order/cancel";
import { useMarkPurchaseOrderOrdered } from "@/hooks/queries/purchase-order/mark-ordered";

import ConfirmDialog from "@/components/confirm-dialog";
import { PageCard, PageCardHeader } from "@/components/page-card";
import { Button, LinkButton } from "@/components/ui/button";

interface Props {
  purchaseOrder: PurchaseOrder;
}

export default function ActionsSection({ purchaseOrder }: Props) {
  const markOrderedQuery = useMarkPurchaseOrderOrdered({
    purchaseOrderId: purchaseOrder.id,
  });

  const cancelQuery = useCancelPurchaseOrder({
    purchaseOrderId: purchaseOrder.id,
  });

  return (
    <PageCard>
      <PageCardHeader title="Actions" />
      <div className="grid grid-cols-2 gap-2">
        {purchaseOrder.status === "draft" && (
          <ConfirmDialog
            description="This will mark the purchase order as ordered."
            confirmText="Mark as Ordered"
            hook={markOrderedQuery}
            onSuccess={() => toast.success("Purchase order marked as ordered")}
          >
            <ActionButton icon={CircleCheckBig}>Mark as Ordered</ActionButton>
          </ConfirmDialog>
        )}
        {purchaseOrder.status === "ordered" && (
          <ActionLinkButton
            icon={PackageCheckIcon}
            href={`/dashboard/purchase-order/${purchaseOrder.id}/receipt`}
          >
            Receipt In
          </ActionLinkButton>
        )}
        {purchaseOrder.status !== "cancelled" && (
          <ConfirmDialog
            description="This will cancel the purchase order."
            confirmText="Cancel Purchase Order"
            hook={cancelQuery}
            onSuccess={() => toast.success("Purchase order cancelled")}
          >
            <ActionButton icon={BanIcon}>Cancel Purchase Order</ActionButton>
          </ConfirmDialog>
        )}
      </div>
    </PageCard>
  );
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  children: ReactNode;
}

function ActionButton({ icon: Icon, children, ...props }: ActionButtonProps) {
  return (
    <Button variant="outline" {...props}>
      <Icon className="size-4" />
      {children}
    </Button>
  );
}

function ActionLinkButton({
  icon: Icon,
  children,
  href,
  ...props
}: ActionButtonProps & { href: string }) {
  return (
    <LinkButton variant="outline" href={href} {...props}>
      <Icon className="size-4" />
      {children}
    </LinkButton>
  );
}
