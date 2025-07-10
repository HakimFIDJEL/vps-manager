// Necessary imports
import { useProject } from "@/contexts/project-context";
import { Link } from "@inertiajs/react";

// Shadcn UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Custom components
import { ContainersList } from "./app-docker";
import { CommandList } from "../show/app-makefile";

// Icons
import {
	Folder,
	FileLock,
	Container,
	SquareTerminal,
	OctagonMinus,
	ArrowRight,
} from "lucide-react";

// Types
import { type tempContainer } from "@/lib/docker/type";

// Contexts
import { useDocker } from "@/contexts/docker-context";
import { useCommand } from "@/contexts/command-context";

export function AppOverview() {
	return (
		<TabsContent value="overview" className="space-y-12">
			{/* Overview */}
			<QuickActions />

			{/* Table of the containers in app-docker */}
			<ContainerOverview />

			{/* Stats of the directory (Not now, todo later : chart)*/}

			{/* Commands to run carrousel */}
			<CommandOverview />

			{/* <div className="flex flex-col gap-2">
				<h3 className="text-sm font-medium">Commands</h3>

				{project.commands.length === 0 ? (
					<div className="flex items-center justify-center border border-border border-dashed rounded-md p-4 bg-muted/50">
						<p className="text-sm text-muted-foreground">
							No commands added yet. Try adding some in the Commands tab.
						</p>
					</div>
				) : (
					<></>
				)}
			</div> */}

			{/* A scrollable table for variables (scrollable in order for it to not be to long..) */}
		</TabsContent>
	);
}

function QuickActions() {
	const { project } = useProject();

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-sm font-medium">Overview</h3>

			<TabsList className="grid grid-cols-2 gap-2 !bg-transparent border-0 shadow-none rounded-none w-full text-foreground h-auto">
				{/* Project Info */}
				<TabsTrigger
					className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 !transition-all duration-200 group relative justify-start text-start"
					value="settings"
				>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/5 rounded-full">
							<Folder className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="font-medium">Project information</h4>
							<div className="flex items-center gap-2">
								<Badge variant={"outline"}>{project.path}</Badge>
							</div>
						</div>
					</div>
					<ArrowRight className="h-4 w-4 text-primary opacity-0 absolute top-4 right-6 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
				</TabsTrigger>

				{/* Variables */}
				<TabsTrigger
					className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 !transition-all duration-200 group relative justify-start text-start"
					value="variables"
				>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/5 rounded-full">
							<FileLock className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="font-medium text-base">Environment Variables</h4>
							<p className="text-sm text-muted-foreground">
								{project.variables.length === 0 ? (
									<span className="text-muted-foreground">No variables configured</span>
								) : (
									<span>
										{project.variables.length} variable
										{project.variables.length > 1 ? "s" : ""} configured
									</span>
								)}
							</p>
						</div>
					</div>
					<ArrowRight className="h-4 w-4 text-primary opacity-0 absolute top-4 right-6 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
				</TabsTrigger>

				{/* Docker */}
				<TabsTrigger
					className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 !transition-all duration-200 group relative justify-start text-start"
					value="containers"
				>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/5 rounded-full">
							<Container className="h-4 w-4 text-primary" />
						</div>
						<div className="flex flex-col">
							<h4 className="font-medium text-base">Docker Compose</h4>
							<p className="text-sm text-muted-foreground flex gap-2">
								{project.docker.isStrict ? (
									<>
										<Badge variant="outline">
											{project.docker.parsed.services.length === 0
												? "No services"
												: `${project.docker.parsed.services.length} service${project.docker.parsed.services.length > 1 ? "s" : ""}`}
										</Badge>
										<Badge variant="outline">
											{project.docker.parsed.volumes.length === 0
												? "No volumes"
												: `${project.docker.parsed.volumes.length} volume${project.docker.parsed.volumes.length > 1 ? "s" : ""}`}
										</Badge>
										<Badge variant="outline">
											{project.docker.parsed.networks.length === 0
												? "No networks"
												: `${project.docker.parsed.networks.length} network${project.docker.parsed.networks.length > 1 ? "s" : ""}`}
										</Badge>
									</>
								) : (
									<Badge variant="outline">
										<OctagonMinus className="!h-3 !w-3" />
										Strict mode disabled
									</Badge>
								)}
							</p>
						</div>
					</div>
					<ArrowRight className="h-4 w-4 text-primary opacity-0 absolute top-4 right-6 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
				</TabsTrigger>

				{/* Commands */}
				<TabsTrigger
					className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 !transition-all duration-200 group relative justify-start text-start"
					value="commands"
				>
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/5 rounded-full">
							<SquareTerminal className="h-4 w-4 text-primary" />
						</div>
						<div>
							<h4 className="font-medium text-base">Makefile Commands</h4>
							<p className="text-sm text-muted-foreground">
								{project.commands.length === 0 ? (
									<span className="text-muted-foreground">No commands configured</span>
								) : (
									<span>
										{project.commands.length} command
										{project.commands.length > 1 ? "s" : ""} configured
									</span>
								)}
							</p>
						</div>
					</div>
					<ArrowRight className="h-4 w-4 text-primary opacity-0 absolute top-4 right-6 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
				</TabsTrigger>
			</TabsList>
		</div>
	);
}

function ContainerOverview() {
	const { handleDockerAction, loading } = useDocker();

	// Variables
	const initialContainers: tempContainer[] = [
		{
			container_id: "a1b2c3d4e5f6",
			image: "containrrr/watchtower:latest",
			command: "/watchtower --cleanup",
			created_at: "2025-06-24T06:15:00Z",
			status: "Up 2 hours",
			state: "running",
			ports: "",
			name: "webproject_watchtower",
		},
		{
			container_id: "b2c3d4e5f6g7",
			image: "node:18-alpine",
			command: "npm start",
			created_at: "2025-06-24T06:00:00Z",
			status: "Up 2 hours",
			state: "running",
			ports: "3000/tcp -> 0.0.0.0:3000",
			name: "webproject_app",
		},
		{
			container_id: "c3d4e5f6g7h8",
			image: "mysql:8.0",
			command: "docker-entrypoint.sh mysqld",
			created_at: "2025-06-24T05:45:00Z",
			status: "Up 3 hours",
			state: "running",
			ports: "3306/tcp -> 0.0.0.0:3306",
			name: "webproject_mysql",
		},
		{
			container_id: "d4e5f6g7h8i9",
			image: "phpmyadmin/phpmyadmin:latest",
			command: "/docker-entrypoint.sh apache2-foreground",
			created_at: "2025-06-24T05:50:00Z",
			status: "Exited (0) 1 hour ago",
			state: "exited",
			ports: "8080/tcp -> 0.0.0.0:8080",
			name: "webproject_phpmyadmin",
		},
	];
	return (
		<ContainersList
			initialContainers={initialContainers}
			handleDockerAction={handleDockerAction}
			loading={loading}
		/>
	);
}

function CommandOverview() {
	const { handleCommandAction, loading } = useCommand();
	return (
		<CommandList
			carrousel
			loading={loading}
			handleCommandAction={handleCommandAction}
		/>
	);
}
