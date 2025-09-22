// lib/logs/formatter.tsx

// Shadcn UI Components
import { Badge } from "@/components/ui/badge";

// Icons
import { Check, X } from "lucide-react";

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

export function formatStatus(successfull : boolean): React.ReactNode {
	return successfull ? (
		<Badge variant={"default"}>
            <Check />
            Success
        </Badge>
	) : (
		<Badge variant={"outline"}>
            <X />
            Failed
        </Badge>
	);
}

export function formatActions(
	id: number | undefined,
	width: "full" | "auto" = "full",
	size: "default" | "icon" | "lg" | "sm" = "default",
): React.ReactNode {
	return (
		<></>
	);
}