// layouts/policies.tsx

// Layouts
import { Header } from "@/components/layouts/policies/header";
import { Nav } from "@/components/layouts/policies/nav";

// Shadcn UI Components
import { TooltipProvider } from "@/components/ui/tooltip";

// Custom components
import { ScrollTop } from "@/components/page/home/scroll-top";

export function PoliciesLayout({ children }: { children: React.ReactNode }) {
	return (
		<TooltipProvider>
			<Header />
			<main className="@container/main  flex flex-1 flex-col container mx-auto lg:py-12 py-24 gap-4 px-6 max-w-2xl">
				<Nav />
				<div className="flex flex-1 flex-col gap-4 relative flex-shrink-0 h-full">
					{children}
				</div>
				<ScrollTop />
			</main>
		</TooltipProvider>
	);
}
