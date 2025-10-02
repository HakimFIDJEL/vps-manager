// lib/logs/formatter.tsx

// Shadcn UI Components
import { Badge } from "@/components/ui/badge";

// Icons
import { Bug, Check, X } from "lucide-react";

export function formatDate(date: string | undefined): string {
	const opts: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	};
	if (!date) {
		return "N/A";
	}
	return new Date(date).toLocaleString("en-US", opts);
}

export function formatSuccessful(successful: boolean): React.ReactNode {
	return (
		<div className="flex justify-center">
			{successful ? (
				<Badge variant="default">
					<Check />
					Success
				</Badge>
			) : (
				<Badge variant="outline">
					<X />
					Failed
				</Badge>
			)}
		</div>
	);
}

export function formatExitCode(exit_code: number): React.ReactNode {
	return <div className="text-center">{exit_code}</div>;
}
