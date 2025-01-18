import { ReactNode } from "react";

interface InternalHeaderProps {
  children: ReactNode;
}

export function InternalHeader({ children }: InternalHeaderProps) {
  return (
    <div className="mb-4 flex h-6 items-center justify-between">{children}</div>
  );
}

interface InternalHeaderActionsProps {
  children: ReactNode;
}

export function InternalHeaderActions({
  children,
}: InternalHeaderActionsProps) {
  return <div className="flex gap-2">{children}</div>;
}
