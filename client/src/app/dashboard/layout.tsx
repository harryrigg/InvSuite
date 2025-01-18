"use client";

import AppSidebar from "@/app/dashboard/sidebar";
import { useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

import DashboardShell from "@/components/page-shell";
import { SidebarProvider } from "@/components/ui/sidebar";

import { routes } from "./routes";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const segment = useSelectedLayoutSegment();
  const activeRoute = segment ? routes.find((v) => v.route == segment) : null;
  if (!activeRoute) return children;

  return (
    <SidebarProvider>
      <AppSidebar activeRoute={activeRoute.route} />
      <DashboardShell pageIcon={activeRoute.icon} pageTitle={activeRoute.name}>
        {children}
      </DashboardShell>
    </SidebarProvider>
  );
}
