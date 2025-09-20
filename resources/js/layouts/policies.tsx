// layouts/policies.tsx

// Layouts
import { Header } from "@/components/layouts/policies/header";

// Custom components
import { ScrollTop } from "@/components/page/home/scroll-top";

export function PoliciesLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="@container/main  flex flex-1 flex-col container mx-auto py-12 gap-4 px-4 max-w-2xl">
			<Header />
			<div className="flex flex-1 flex-col gap-4 relative py-6 flex-shrink-0 h-full">
				{children}
			</div>
			<ScrollTop />
		</main>
	);
}
