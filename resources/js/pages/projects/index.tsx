// Necessary imports
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

// Components
import { AdminLayout } from "@/components/layouts/admin-layout";

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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import {
	ArrowUpRight,
	Check,
	Folder,
	LayoutGrid,
	Plus,
	RefreshCcw,
	TableProperties,
	TriangleAlert,
	X,
} from "lucide-react";

// Types
import { type Project, type Container } from "@/types/models/project";

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
	const formatDate = (date: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		};
		return new Date(date).toLocaleString("en-US", options);
	};

	const formatContainers = (containers: Container[]) => {
		const runningCount = containers.filter((c) => c.status === "running").length;
		const totalCount = containers.length;
		const percent = totalCount > 0 ? (runningCount / totalCount) * 100 : 0;

		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Progress value={percent} className="w-[100px]" />
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{runningCount === totalCount
							? "All containers are running"
							: `${runningCount} out of ${totalCount} containers running`}
					</p>
				</TooltipContent>
			</Tooltip>
		);
	};

	const formatTraefik = (traefik_enabled: boolean) => {
		return (
			<>
				{traefik_enabled ? (
					<Badge variant={"outline"} className="flex items-center gap-2">
						Enabled
						<Check />
					</Badge>
				) : (
					<Badge variant={"secondary"}>
						Disabled
						<X />
					</Badge>
				)}
			</>
		);
	};

	const formatActions = (inode: number) => {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<a href={route("projects.show", { inode })}>
						<Button variant="outline" size="sm">
							<ArrowUpRight className="h-4 w-4" />
						</Button>
					</a>
				</TooltipTrigger>
				<TooltipContent>Show project</TooltipContent>
			</Tooltip>
		);
	};

	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="Projects" />

			<Tabs defaultValue="grid" className="w-full">
				<TabsList className="grid w-max grid-cols-2">
					<TabsTrigger value="grid">
						<LayoutGrid />
					</TabsTrigger>
					<TabsTrigger value="list">
						<TableProperties />
					</TabsTrigger>
				</TabsList>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Folder />
							Projects
						</CardTitle>
						<CardDescription>List of all projects</CardDescription>
						<CardAction className="flex items-center gap-2">
							<a href={route("projects.index")}>
								<Button variant={"secondary"}>
									<RefreshCcw />
								</Button>
							</a>
							<a href={route("projects.create")}>
								<Button variant={"outline"}>
									Create a new project
									<Plus />
								</Button>
							</a>
						</CardAction>
					</CardHeader>
					<Separator />
					<CardContent>
						<TabsContent value="grid">
							{/* Cards */}
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{projects.map((project) => (
									<Card key={project.inode}>
										<CardHeader>
											<CardTitle>{project.name}</CardTitle>
											<CardDescription>{project.folder}</CardDescription>
											<CardAction>{formatActions(project.inode)}</CardAction>
										</CardHeader>
										<Separator />
										<CardContent className="grid gap-2">
											<div className="flex items-center justify-between">
												<p>Inode</p>
												<p className="font-mono">#{project.inode}</p>
											</div>
											<div className="flex items-center justify-between">
												<p>Traefik</p>
												{formatTraefik(project.traefik_enabled)}
											</div>
											<div className="flex items-center justify-between">
												<p>Containers</p>
												{formatContainers(project.containers)}
											</div>
											<div className="flex items-center justify-between text-sm">
												<p>Updated At</p>
												<p>{formatDate(project.updated_at)}</p>
											</div>
											<div className="flex items-center justify-between text-sm">
												<p>Created At</p>
												<p>{formatDate(project.created_at)}</p>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
						<TabsContent value="list">
							{/* Table */}
							<Table>
								<TableHeader className="bg-muted/50">
									<TableRow>
										<TableHead>Inode</TableHead>
										<TableHead>Project</TableHead>
										<TableHead>Folder</TableHead>
										<TableHead>Traefik</TableHead>
										<TableHead>Containers</TableHead>
										<TableHead>Updated At</TableHead>
										<TableHead>Created At</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{projects.map((project) => (
										<TableRow key={project.name}>
											<TableCell className="font-mono">#{project.inode}</TableCell>
											<TableCell>{project.name}</TableCell>
											<TableCell className="font-mono">{project.folder}</TableCell>
											<TableCell>{formatTraefik(project.traefik_enabled)}</TableCell>
											<TableCell>{formatContainers(project.containers)}</TableCell>
											<TableCell>{formatDate(project.updated_at)}</TableCell>
											<TableCell>{formatDate(project.created_at)}</TableCell>
											<TableCell className="text-right">
												{formatActions(project.inode)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TabsContent>
					</CardContent>
					<Separator />
					<CardFooter className="text-sm text-muted-foreground flex items-center gap-2">
						<TriangleAlert />
						All projects are fetched from the server itself without a database, if a
						project is not found, try reloading the page, check the server logs or access the sever via SSH.
					</CardFooter>
				</Card>
			</Tabs>
		</AdminLayout>
	);
}
