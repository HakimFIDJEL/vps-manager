// Necessary imports
import { Link } from "@inertiajs/react";

// Shadcn ui components
import { Button } from "@/components/ui/button";

// Icons
import { ArrowUpRight } from "lucide-react";

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

export function formatSize(size: number | undefined) {
	if (size === undefined) {
		return "N/A";
	}
	const sizeInMB = (size / 1024).toFixed(2);
	return `${sizeInMB} MB`;
}

export function formatActions(
	inode: number | undefined,
	width: "full" | "auto" = "full",
	size: "default" | "icon" | "lg" | "sm" = "default",
): React.ReactNode {
	return (
		<Link
			href={route("projects.show", { inode: inode })}
			className={`w-${width}`}
		>
			<Button variant="outline" className={`w-${width}`} size={size}>
				<ArrowUpRight className="h-4 w-4" />
				Show project
			</Button>
		</Link>
	);
}

export function formatSlug(input: string): string {
	const keepDashAtEnd = input.endsWith(" ") || input.endsWith("-");

	let slug = input
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9_\/-]+/g, "-")
		.replace(/-{2,}/g, "-")
		.replace(/^-+/g, "");

	if (keepDashAtEnd && !slug.endsWith("-")) {
		slug += "-";
	}

	return slug;
}
