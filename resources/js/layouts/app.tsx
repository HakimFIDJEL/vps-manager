// layoutes/app.tsx

// Necessary imports
import { usePage } from "@inertiajs/react";
import { getCookie, isCookieConsent } from "@/lib/utils";

// Providers
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import { AppHeader } from "@/components/layouts/header/_header";

// Types
import { type BreadcrumbItem } from "@/types";
import { type ReactNode } from "react";

// Custom components
import { Breadcrumbs } from "@/components/layouts/header/breadcrumbs";
import { CustomToaster } from "@/components/layouts/custom-toaster";
import { ResponsiveBlocker } from "@/components/layouts/responsive-blocker";

// Shadcn UI components
import { CookieConsent } from "@/components/ui/cookie-consent";


interface AppLayoutProps {
	children: ReactNode;
	breadcrumbs?: BreadcrumbItem[];
}

export function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
	const { props } = usePage<{
		flash?: { success?: string; error?: string };
		success?: string;
		error?: string;
	}>();

	const sidebar_toggle = isCookieConsent()
		? getCookie("sidebar_toggle") || "true"
		: "true";


	return (
		<TooltipProvider>
			{/* <SidebarProvider className="bg-muted/50 dark:bg-background" defaultOpen={sidebar_toggle === "true"}> */}
			{/* <AppSidebar variant="floating" /> */}
			{/* <SidebarInset className="bg-muted/50 dark:bg-background"> */}
			<AppHeader breadcrumbs={breadcrumbs} />
			<main className="@container/main  flex flex-1 flex-col container mx-auto py-6 gap-4 px-4">
				<Breadcrumbs breadcrumbs={breadcrumbs} />
				<div className="flex flex-1 flex-col gap-4 relative py-6 flex-shrink-0 h-full">
					{children}

					<CustomToaster {...props}/>
				</div>
			</main>
			{/* </SidebarInset> */}
			<ResponsiveBlocker />
			<CookieConsent variant={"mini"} />
			{/* </SidebarProvider> */}
		</TooltipProvider>
	);
}
