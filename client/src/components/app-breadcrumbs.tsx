"use client";

import Link from "next/link";
import { Fragment, ReactNode, createContext, useContext } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbNode = {
  name: string;
  route: string;
};

const BreadcrumbContext = createContext<BreadcrumbNode[]>([]);

interface BreadcrumbNodeProviderProps {
  name: string;
  route: string;
  children: ReactNode;
}

export function BreadcrumbNodeProvider({
  name,
  route,
  children,
}: BreadcrumbNodeProviderProps) {
  const current = useContext(BreadcrumbContext);
  const parentRoute = current[current.length - 1]?.route ?? "/dashboard";

  return (
    <BreadcrumbContext.Provider
      value={[...current, { name, route: `${parentRoute}/${route}` }]}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

interface AppBreadcrumbsProps {
  page?: string;
}

export function AppBreadcrumbs({ page }: AppBreadcrumbsProps) {
  const nodes = useContext(BreadcrumbContext);

  const parentNodes = page ? nodes : nodes.slice(0, -1);
  const pageName = page ? page : nodes[nodes.length - 1].name;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {parentNodes.map((node) => (
          <Fragment key={node.name}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={node.route}>{node.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{pageName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
