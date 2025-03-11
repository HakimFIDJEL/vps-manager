"use client";

// Shadcn components
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { useSidebar } from "@workspace/ui/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

// Icons
import { SidebarIcon } from "lucide-react";

// Custom Components
import { SearchForm } from "@/components/admin/layout/header/search-form";
import { Theme } from "@/components/elements/theme";
import { HeaderBreadcrumb } from "@/components/admin/layout/header/header-breadcrumb";

// Hook pour récupérer les breadcrumbs
import { useBreadcrumbContext } from "@/providers/breadcrumb/provider";

export function LayoutHeader() {
  const { toggleSidebar } = useSidebar();
  const { breadcrumbs } = useBreadcrumbContext();

  return (
    <header className="fle sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center gap-2 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-8 w-8"
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
            >
              <SidebarIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Sidebar</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mr-2 h-4" />

        <HeaderBreadcrumb items={breadcrumbs} />

        <SearchForm className="w-full sm:ml-auto sm:w-auto" />

        <Separator orientation="vertical" className="mx-2 h-4" />

        
        <Theme />
      </div>
    </header>
  );
}
