// Necessary imports
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

// Components
import { AdminLayout } from "@/components/layouts/admin-layout";
import { AppTable } from "@/components/page/projects/index/app-table";
import { AppGrid } from "@/components/page/projects/index/app-grid";

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
import { Tabs, TabsBody, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import {
	Folder,
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
		title: "Dashboard",
		href: route("dashboard"),
	},
	{
		title: "Projects",
		href: route("projects.index"),
	},
];

export default function Page() {
	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="Projects" />

			<Tabs defaultValue="list" className="w-full">
				<TabsList className="grid w-max grid-cols-2">
					<TabsTrigger value="list">
						<TableProperties />
					</TabsTrigger>
					<TabsTrigger value="grid">
						<LayoutGrid />
					</TabsTrigger>
				</TabsList>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
						<Folder className="w-5 h-5 text-muted-foreground" />
							Projects
						</CardTitle>
						<CardDescription>List of all projects</CardDescription>
						<CardAction className="flex items-center gap-2">
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

					<Separator />
					<CardFooter className="text-sm text-muted-foreground flex items-center gap-2">
						<TriangleAlert />
						All projects are fetched from the server itself without a database, if a
						project is not found, try reloading the page, check the server logs or
						access the sever via SSH.
					</CardFooter>
				</Card>
			</Tabs>
		</AdminLayout>
	);
}
