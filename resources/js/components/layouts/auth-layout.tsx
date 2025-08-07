// Necessary imports
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

// Providers
import { TooltipProvider } from "@/components/ui/tooltip";

// Types
import { type ReactNode } from "react";

// Custom components
import { ResponsiveBlocker } from "./responsive-blocker";
import AppearanceToggleDropdown from "@/components/layouts/header/theme";
import { CustomToaster } from "./custom-toaster";

// Shadcn UI components
import { CookieConsent } from "@/components/ui/cookie-consent";

interface AuthLayoutProps {
	children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
	const { props } = usePage<{
		flash?: { success?: string; error?: string };
		success?: string;
		error?: string;
	}>();

	return (
		<TooltipProvider>
			{/* Header */}
			<header className="absolute top-0 z-10 w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
				<div className="mx-auto flex w-full items-center justify-between gap-2 p-4">
					<div className="flex w-full items-center gap-1 lg:gap-2">
						<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg mr-2">
							<span className="text-xl text-white italic font-bold -translate-x-[0.5px] -translate-y-[0.5px]">
								H
							</span>
						</div>
					</div>
					<div className="flex items-center gap-1 lg:gap-2">
						<AppearanceToggleDropdown />
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="@container/main  flex flex-1 flex-col container mx-auto h-[100vh] align-center justify-center  ">
				<div className="w-full max-w-sm md:max-w-3xl mx-auto">{children}</div>

				<CustomToaster {...props}/>
			</main>

			<ResponsiveBlocker />
			<CookieConsent variant={"mini"} />
		</TooltipProvider>
	);
}
