import { PackageOpen } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/hooks/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavUser } from "./nav-user";
import { routes } from "./routes";

interface Props {
  activeRoute: string;
}

export default function AppSidebar({ activeRoute }: Props) {
  const { user } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <PackageOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">InvSuite</span>
                  <span className="truncate text-xs">
                    {user ? user.business_name : <>&nbsp;</>}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.name}>
                <SidebarMenuButton
                  isActive={route.route === activeRoute}
                  asChild
                >
                  <Link href={`/dashboard/${route.route}`}>
                    <route.icon />
                    <span>{route.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
