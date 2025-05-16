import { type BreadcrumbItem } from '@/types';
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumbs } from "@/components/layouts/header/breadcrumbs"
import AppearanceToggleDropdown from '@/components/layouts/header/theme';

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {breadcrumbs.length > 0 && (
            <div className="border-sidebar-border/70 flex w-full border-b">
                <div className="mr-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
        )}
      </div>
      <div className='flex items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <AppearanceToggleDropdown />
      </div>
    </header>
  )
}
