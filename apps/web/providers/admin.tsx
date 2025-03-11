"use client";

import * as React from "react";
import { LayoutSidebar } from "@/components/admin/layout/sidebar/_sidebar";
import { LayoutHeader } from "@/components/admin/layout/header/_header";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";
import { BreadcrumbProvider } from "@/providers/breadcrumb/provider";
import { ConfirmDialogProvider } from '@omit/react-confirm-dialog'

export function AdminProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ConfirmDialogProvider>
      <SidebarProvider className="flex flex-col">
        <BreadcrumbProvider>
          <LayoutHeader />
          <div className="flex flex-1">
            <LayoutSidebar />
            <SidebarInset className={`${className} p-2`}>{children}</SidebarInset>
          </div>
        </BreadcrumbProvider>
      </SidebarProvider>
    </ConfirmDialogProvider>
  );
}
