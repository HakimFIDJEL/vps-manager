// Providers
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

// Layouts
import { AppSidebar } from "@/components/layouts/sidebar/_sidebar"
import { AppHeader } from "@/components/layouts/header/_header"

// Types
import { type BreadcrumbItem } from "@/types"
import { type ReactNode } from 'react';

// Shadcn UI components
import { Toaster } from "@/components/ui/sonner"

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function AdminLayout({
  children,
  breadcrumbs = [],
}: AdminLayoutProps) {

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar variant="floating" />
        <SidebarInset>
          <AppHeader breadcrumbs={breadcrumbs} />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-4 relative py-6 px-2">

                { children }

                <Toaster richColors closeButton />

                {/* <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} /> */}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
