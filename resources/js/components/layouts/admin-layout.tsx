// Providers
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/layouts/sidebar/_sidebar"
import { AppHeader } from "@/components/layouts/header/_header"

import { type BreadcrumbItem } from "@/types"
import { type ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function AdminLayout({
  children,
  breadcrumbs = [],
}: AdminLayoutProps) {

  return (
    <SidebarProvider>
      <AppSidebar variant="floating" />
      <SidebarInset>
        <AppHeader breadcrumbs={breadcrumbs} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 relative py-6">

              { children }

              {/* <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} /> */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
