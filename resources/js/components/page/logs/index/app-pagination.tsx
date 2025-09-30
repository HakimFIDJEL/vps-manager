// components/page/logs/index/app-pagination.tsx

// Necessary imports

// Shadcn UI components
import { Card, CardContent } from "@/components/ui/card";

// Types
import { type Log } from "@/lib/logs/type";

export function AppPagination({ logs }: { logs: Log[] }) {
	return (
		<Card className="bg-transparent">
			<CardContent className="flex justify-center">
				Here will be the pagination controls.
			</CardContent>
		</Card>
	);
}
