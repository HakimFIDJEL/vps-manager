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

// Shadcn UI components
import { CookieConsent } from "@/components/ui/cookie-consent";
import { Toaster } from "@/components/ui/sonner";

// Icons
import { Check, Info, Loader2, X } from "lucide-react";

interface AuthLayoutProps {
	children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
	const { props } = usePage<{
		flash?: { success?: string; error?: string };
		success?: string;
		error?: string;
	}>();

	useEffect(() => {
		const flashSuccess =
			props.flash?.success ?? (props.success as string | undefined);
		const flashError = props.flash?.error ?? (props.error as string | undefined);

		console.log("Flash messages:", { flashSuccess, flashError });

		if (flashSuccess) {
			toast.success(flashSuccess);
		}
		if (flashError) {
			toast.error(flashError);
		}
	}, [props]);

	return (
		<TooltipProvider>
			{/* Header */}
			<header className="absolute top-0 z-10 w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
				<div className="mx-auto flex w-full items-center justify-between gap-2 p-4">
					<div className="flex w-full items-center gap-1 lg:gap-2">
						<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg mr-2">
							<span className="text-xl text-white italic font-bold -translate-x-[0.5px] -translate-y-[0.5px]">H</span>
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
			</main>

			<ResponsiveBlocker />
			<CookieConsent variant={"mini"} />
		</TooltipProvider>
	);
}
