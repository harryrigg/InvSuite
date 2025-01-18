import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DetailProps {
  label: string;
  children: ReactNode;
}

export function Detail({ label, children }: DetailProps) {
  const childrenDisplay = children ?? "N/A";

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-semibold">{childrenDisplay}</span>
    </div>
  );
}

interface DetailRowProps {
  children: ReactNode;
}

export function DetailRow({ children }: DetailRowProps) {
  return <div className="flex [&>*]:flex-1">{children}</div>;
}

interface DetailColumnProps {
  children: ReactNode;
  className?: string;
}

export function DetailColumn({ children, className }: DetailColumnProps) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}
