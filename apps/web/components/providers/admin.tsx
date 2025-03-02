"use client";

import * as React from "react";
import { LayoutSidebar } from "@/components/admin/layout/sidebar/_sidebar";
import { LayoutHeader } from "@/components/admin/layout/header/_header";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb/provider";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

export function AdminProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
      <SidebarProvider className="flex flex-col">
        <BreadcrumbProvider>
          <LayoutHeader />
          <div className="flex flex-1">
            <LayoutSidebar />
            <SidebarInset className={`${className} p-2`}>{children}</SidebarInset>
          </div>
        </BreadcrumbProvider>
      </SidebarProvider>
  );
}
