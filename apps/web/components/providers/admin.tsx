"use client";

import * as React from "react";

// Composants layouts
import { LayoutSidebar } from "@/components/admin/layout/sidebar/_sidebar"
import { LayoutHeader } from "@/components/admin/layout/header/_header"

// A importer
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"


export function AdminPovider({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <SidebarProvider className="flex flex-col">
      <LayoutHeader />
      <div className="flex flex-1">
        <LayoutSidebar />
        <SidebarInset className={`${className} p-2`}>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
