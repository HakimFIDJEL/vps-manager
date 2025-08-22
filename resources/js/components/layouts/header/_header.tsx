// Necessary imports
import { Link } from "@inertiajs/react";

// Custom components
import { Breadcrumbs } from "@/components/layouts/header/breadcrumbs";
import AppearanceToggleDropdown from "@/components/layouts/header/theme";
import { Logo } from "../logo";

// Shadcn UI components
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Icons
import { Folder, Layers, LogOut } from "lucide-react";

// Types
import { type BreadcrumbItem } from "@/types";

interface AppHeaderProps {
	breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
	return (
		<header className="sticky top-0 bg-muted/50 dark:bg-background backdrop-blur-2xl z-10 w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
			<div className="container mx-auto flex w-full items-center justify-between gap-2 px-4">
				<div className="flex w-full items-center gap-1 lg:gap-2">
					{/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md mr-2">
						<span className="text-xl text-white italic font-bold -translate-x-[0.5px] -translate-y-[0.5px]">H</span>
					</div> */}
					<Logo />

					<Separator
						orientation="vertical"
						className="mx-2 data-[orientation=vertical]:h-4"
					/>

					<Link href={route("projects.index")}>
						<Button
							variant={"ghost"}
							size={"sm"}
							className={`${!route().current("projects.*") ? "text-muted-foreground" : ""} gap-3`}
						>
							<Layers className="h-4 w-4" />
							<span className="hidden lg:inline">Projects</span>
						</Button>
					</Link>

					{/* <SidebarTrigger className="-ml-1"  /> */}
					{/*
            {breadcrumbs.length > 0 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="mr-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )} */}
				</div>
				<div className="flex items-center gap-1 lg:gap-2">
					<AppearanceToggleDropdown />
					<Separator
						orientation="vertical"
						className="data-[orientation=vertical]:h-4"
					/>
					<Link href={route("auth.logout")}>
						<Button size={"sm"} variant={"default"} className="ml-2">
							<LogOut className="h-4 w-4" />
							<span className="hidden lg:inline">Log out</span>
						</Button>
					</Link>
				</div>
			</div>
		</header>
	);
}
