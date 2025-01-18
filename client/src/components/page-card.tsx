import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageCardProps {
  children: ReactNode;
}

export function PageCard({ children }: PageCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow">{children}</div>
  );
}

interface PageCardHeaderProps {
  title: ReactNode;
  subTitle?: ReactNode;
}

export function PageCardHeader({ title, subTitle }: PageCardHeaderProps) {
  return (
    <>
      <h2 className="text-lg font-semibold">{title}</h2>
      {subTitle && <h3 className="text-md text-gray-600">{subTitle}</h3>}
      <PageCardDivider className="my-4" />
    </>
  );
}

interface PageCardFooterProps {
  children: ReactNode;
}

export function PageCardFooter({ children }: PageCardFooterProps) {
  return (
    <>
      <PageCardDivider />
      <div className="flex justify-end gap-2">{children}</div>
    </>
  );
}

interface PageCardDividerProps {
  className?: string;
}

export function PageCardDivider({ className }: PageCardDividerProps) {
  return <hr className={cn("-mx-4 my-4 border-t", className)} />;
}

interface PageCardContainerProps {
  children: ReactNode;
}

export function PageCardContainer({ children }: PageCardContainerProps) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
