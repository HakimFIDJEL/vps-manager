// components/page/logs/index/app-pagination.tsx

// Necessary imports

// Shadcn UI components
import { Card, CardContent } from "@/components/ui/card";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

// Types
import { LogProps } from "@/lib/logs/type";
import { router } from "@inertiajs/react";

export function AppPagination(props: LogProps) {
	const totalPages = Number(props.pages);
	const current = Number(props.page);
	const delta = 2; // nbr of pages to show around current
	const range: number[] = [];
	const rangeWithDots: (number | string)[] = [];
	let l: number | undefined;

	// Always include start and end + interval around current
	for (let i = 1; i <= totalPages; i++) {
		if (
			i === 1 ||
			i === totalPages ||
			(i >= current - delta && i <= current + delta)
		) {
			range.push(i);
		}
	}

	// Add dots
	for (let i of range) {
		if (l !== undefined) {
			if (i - l === 2) {
				rangeWithDots.push(l + 1);
			} else if (i - l > 2) {
				rangeWithDots.push("ellipsis");
			}
		}
		rangeWithDots.push(i);
		l = i;
	}

	// Avoid refresh when switching page
	function handleVisit(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		if (e.currentTarget.getAttribute("href") !== "#") {
			e.preventDefault();
		}

		router.visit(e.currentTarget.getAttribute("href") || "#", {
			preserveState: true,
			preserveScroll: true,
		});
	}

	return (
		<Pagination>
			{totalPages > 0 && (
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={handleVisit}
							href={route("logs.index", { page: current - 1 })}
							disabled={current === 1}
						/>
					</PaginationItem>
					{rangeWithDots.map((page, idx) =>
						page === "ellipsis" ? (
							<PaginationItem key={`dots-${idx}`}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={page}>
								<PaginationLink
									href={page === current ? "#" : route("logs.index", { page })}
									isActive={page === current}
									onClick={handleVisit}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							onClick={handleVisit}
							href={route("logs.index", { page: current + 1 })}
							disabled={current === totalPages || totalPages === 0}
						/>
					</PaginationItem>
				</PaginationContent>
			)}
		</Pagination>
	);
}
