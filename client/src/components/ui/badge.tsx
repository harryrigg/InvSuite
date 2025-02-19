import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300 gap-1.5 h-max",
  {
    variants: {
      variant: {
        positive: "border-green-700 bg-green-50 text-green-700",
        secondary: "border-blue-700 bg-blue-50 text-blue-700",
        draft: "border-amber-700 bg-amber-50 text-amber-700",
        negative: "border-red-700 bg-red-50 text-red-700",
        neutral: "border-gray-700 bg-gray-100 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

const bubbleVariants = cva("size-1 rounded-full", {
  variants: {
    variant: {
      positive: "bg-green-600",
      secondary: "bg-blue-600",
      draft: "bg-amber-600",
      negative: "bg-red-600",
      neutral: "bg-gray-600",
    },
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  bubble?: boolean;
}

function Badge({
  className,
  variant,
  bubble = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {bubble && <span className={bubbleVariants({ variant })} />}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
