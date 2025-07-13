// Necessary imports
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

// Providers
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import { AppSidebar } from "@/components/layouts/sidebar/_sidebar";
import { AppHeader } from "@/components/layouts/header/_header";

// Types
import { type BreadcrumbItem } from "@/types";
import { type ReactNode } from "react";

// Shadcn UI components
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ResponsiveBlocker } from "./responsive-blocker";
import { Check, Loader2, X } from "lucide-react";
import { Breadcrumbs } from "./header/breadcrumbs";

interface AdminLayoutProps {
	children: ReactNode;
	breadcrumbs?: BreadcrumbItem[];
}

export function AdminLayout({ children, breadcrumbs = [] }: AdminLayoutProps) {
	const { props } = usePage<{
		flash?: { success?: string; error?: string };
		success?: string;
		error?: string;
	}>();

	const sidebar_toggle = document.cookie
		.split("; ")
		.find((row) => row.startsWith("sidebar_toggle="))
		?.split("=")[1];

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
							loading: (
								<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
							),
						}}
						toastOptions={{
							classNames: {
								closeButton: "!right-0 !top-3 !left-auto absolute",
							},
						}}
						closeButton
					/>
				</div>
			</main>
			{/* </SidebarInset> */}
			<ResponsiveBlocker />
			{/* </SidebarProvider> */}
		</TooltipProvider>
	);
}
