// layouts/auth.tsx

// Necessary imports
import { usePage } from "@inertiajs/react";

// Providers
import { TooltipProvider } from "@/components/ui/tooltip";

// Types
import { type ReactNode } from "react";

// Custom components
import { ResponsiveBlocker } from "@/components/layouts/app/responsive-blocker";
import AppearanceToggleDropdown from "@/components/layouts/app/header/theme";
import { CustomToaster } from "@/components/layouts/app/custom-toaster";

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
						{/* <Logo /> */}
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
			{/* <CookieConsent variant={"mini"} /> */}
		</TooltipProvider>
	);
}
