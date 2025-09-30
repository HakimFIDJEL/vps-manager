// pages/logs/index.tsx

// Necessary imports
import { Head } from "@inertiajs/react";

// Layout
import { AppLayout } from "@/layouts/app";

// Custom components
import { AppTable } from "@/components/page/logs/index/app-table";
import { AppPagination } from "@/components/page/logs/index/app-pagination";

// Types
import { type BreadcrumbItem } from "@/types";
import { type Log } from "@/lib/logs/type";
import { SmoothItem } from "@/components/ui/smooth-resized";
import { Appheader } from "@/components/page/logs/index/app-header";


const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "VPS Manager",
		link: false,
	},
	{
		title: "Logs",
		href: route("logs.index"),
		link: true,
	},
];

export default function Index({ logs }: { logs: Log[] }) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Logs" />

			<Content logs={logs} />
		</AppLayout>
	);
}

export function Content({ logs }: { logs: Log[] }) {

	return (
		<>
			{/* Title */}
			<SmoothItem delay={0.1}>
				<Appheader logs={logs} />
			</SmoothItem>

			{/* Table */}
			<SmoothItem delay={0.3} layout={false}>
				<AppTable logs={logs} />
			</SmoothItem>

			{/* Pagination */}
			<SmoothItem delay={0.5}>
				<AppPagination logs={logs} />
			</SmoothItem>
		</>
	);
}
