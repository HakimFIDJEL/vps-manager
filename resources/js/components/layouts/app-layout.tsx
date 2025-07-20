// Necessary imports
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { getCookie, isCookieConsent } from "@/lib/utils";
import { toast } from "sonner";

// Providers
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import { AppSidebar } from "@/components/layouts/sidebar/_sidebar";
import { AppHeader } from "@/components/layouts/header/_header";

// Types
import { type BreadcrumbItem } from "@/types";
import { type ReactNode } from "react";

// Custom components
import { Breadcrumbs } from "./header/breadcrumbs";
import { ResponsiveBlocker } from "./responsive-blocker";

// Shadcn UI components
import { CookieConsent } from "@/components/ui/cookie-consent";
import { Toaster } from "@/components/ui/sonner";

// Icons
import { Check, Info, Loader2, X } from "lucide-react";

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

	useEffect(() => {
		const flashSuccess =
			props.flash?.success ?? (props.success as string | undefined);
		const flashError = props.flash?.error ?? (props.error as string | undefined);

		if (flashSuccess) {
			toast.success(flashSuccess);
		}
		if (flashError) {
			toast.error(flashError);
		}
	}, [props]);

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

					<Toaster
						icons={{
							success: <Check className="h-4 w-4 text-primary" />,
							error: <X className="h-4 w-4 text-destructive" />,
							info: <Info className="h-4 w-4 text-muted-foreground" />,
							loading: (
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
							),
						}}
						toastOptions={{
							classNames: {
								closeButton:
									"!right-0 !top-3 !left-auto absolute hover:!bg-accent hover:!border-border",
							},
						}}
						closeButton
					/>
				</div>
			</main>
			{/* </SidebarInset> */}
			<ResponsiveBlocker />
			<CookieConsent variant={"mini"} />
			{/* </SidebarProvider> */}
		</TooltipProvider>
	);
}
