// Necessary imports
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import React from "react";

// Components
import { AdminLayout } from "@/components/layouts/admin-layout";
import { AppTable } from "@/components/page/projects/index/app-table";
import { AppGrid } from "@/components/page/projects/index/app-grid";
import { SmoothItem } from "@/components/ui/smooth-resized";

// Shadcn UI components
import {
	Card,
	CardAction,
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tabs,
	TabsBody,
	TabsContent,
	TabsList,
	TabsTrigger,
	useTabsContext,
} from "@/components/ui/tabs";

// Icons
import {
	Folder,
	Layers,
	LayoutGrid,
	Plus,
	RefreshCcw,
	TableProperties,
	TriangleAlert,
	X,
} from "lucide-react";

const projects = [
	{
		inode: 1048577,
		name: "Portfolio",
		folder: "/projects/portfolio",
		traefik_enabled: true,
		updated_at: "2025-01-01 00:00:00",
		created_at: "2025-01-01 00:00:00",
		containers: [
			{
				name: "portfolio-app",
				image: "portfolio-app:latest",
				status: "running",
				updated_at: "2025-01-01 00:00:00",
				created_at: "2025-01-01 00:00:00",
			},
			{
				name: "portfolio-db",
				image: "mysql:8.0",
				status: "exited",
				updated_at: "2025-01-01 00:00:00",
				created_at: "2025-01-01 00:00:00",
			},
			{
				name: "portfolio-phpmyadmin",
				image: "phpmyadmin:latest",
				status: "running",
				updated_at: "2025-01-01 00:00:00",
				created_at: "2025-01-01 00:00:00",
			},
		],
	},
	{
		inode: 1048578,
		name: "Jcoaching",
		folder: "/projects/jcoaching",
		traefik_enabled: false,
		updated_at: "2025-01-01 00:00:00",
		created_at: "2025-01-01 00:00:00",
		containers: [
			{
				name: "jcoaching-app",
				image: "jcoaching-app:latest",
				status: "running",
				updated_at: "2025-01-01 00:00:00",
				created_at: "2025-01-01 00:00:00",
			},
			{
				name: "jcoaching-db",
				image: "mysql:8.0",
				status: "running",
				updated_at: "2025-01-01 00:00:00",
				created_at: "2025-01-01 00:00:00",
			},
			{
				name: "jcoaching-phpmyadmin",
				image: "phpmyadmin:latest",
				status: "running",
				updated_at: "2025-01-01 00:00:00",
				created_at: "2025-01-01 00:00:00",
			},
			{
				name: "jcoaching-websocket",
				image: "jcoaching-app:latest",
				status: "exited",
				updated_at: "2025-01-01 00:00:00",
				created_at: "2025-01-01 00:00:00",
			},
		],
	},
];

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Projects",
		href: route("projects.index"),
	},
];

export default function Page() {
	const defaultTab =
		document.cookie
			.split("; ")
			.find((row) => row.startsWith("project_index_tab="))
			?.split("=")[1] || "list";
	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="Projects" />

			<Tabs className="w-full" defaultValue={defaultTab || "list"}>
				<Content />
			</Tabs>
		</AdminLayout>
	);
}

function Content() {
	const { currentValue } = useTabsContext();

	React.useEffect(() => {
		document.cookie = `project_index_tab=${currentValue}; max-age=31536000; SameSite=Lax`;
		console.log("Current tab saved to cookie:", currentValue);
	}, [currentValue]);
	return (
		<>
			<SmoothItem
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				delay={0.1}
			>
				<TabsList className="grid w-max grid-cols-2">
					<TabsTrigger value="list">
						<TableProperties />
					</TabsTrigger>
					<TabsTrigger value="grid">
						<LayoutGrid />
					</TabsTrigger>
				</TabsList>
			</SmoothItem>

			<SmoothItem delay={0.3}>
				<Card>
					<CardHeader className="gap-0 gap-x-1.5">
						<div className="flex items-center gap-3">
							<div className="bg-card border rounded-md p-2">
								<Layers className="w-5 h-5 text-muted-foreground" />
							</div>
							<div>
								<CardTitle className="flex items-center gap-2 text-xl">
									Projects
								</CardTitle>
								<CardDescription>
									Manage your projects and their containers. You can create, edit, and delete projects as needed.
								</CardDescription>
							</div>
						</div>
						<CardAction className="flex items-center gap-2 self-center">
							<Link href={route("projects.index")}>
								<Button variant={"secondary"}>
									<RefreshCcw />
								</Button>
							</Link>
							<Link href={route("projects.create")}>
								<Button variant={"default"}>
									<Plus />
									Create a new project
								</Button>
							</Link>
						</CardAction>
					</CardHeader>
					<Separator />

					<CardContent>
						<TabsBody>
							<TabsContent value="grid">
								{/* Cards */}
								<AppGrid projects={projects} />
							</TabsContent>
							<TabsContent value="list">
								{/* Table */}
								<AppTable projects={projects} />
							</TabsContent>
						</TabsBody>
					</CardContent>
				</Card>
			</SmoothItem>
		</>
	);
}
