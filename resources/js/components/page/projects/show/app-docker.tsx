// Necessary imports
import { useState, useEffect } from "react";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogBody,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
	Table,
	TableCell,
	TableBody,
	TableHead,
	TableRow,
	TableHeader,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// Custom components
import { DockerConfiguration } from "../create/app-docker";
import { SmoothAnimate } from "@/components/ui/smooth-resized";

// Icons
import {
	Download,
	Play,
	Octagon,
	CircleMinus,
	Eraser,
	ChartPie,
	Check,
	AlertCircleIcon,
	Ellipsis,
	OctagonMinus,
	RefreshCcw,
	Loader2,
} from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";
import { useDocker } from "@/contexts/docker-context";
import type { DockerAction } from "@/lib/docker/type";

// Libs
import {
	formatContainerDate,
	formatContainerPort,
	formatContainerState,
} from "@/lib/docker/formatter";

// Types
import { type Project } from "@/lib/projects/type";
import { type DockerContainer } from "@/lib/docker/type";

export function AppDocker({
	timerPercentage,
}: {
	timerPercentage: number;
}) {
	// Custom Hooks
	const { project } = useProject();
	const { handleDocker, loading, containers } = useDocker();

	return (
		<TabsContent value="containers" className="flex flex-col gap-12">
			{/* Quick actions */}
			<QuickActions
				handleDocker={handleDocker}
				containers={containers}
				loading={loading}
				timerPercentage={timerPercentage}
				project={project}
			/>

			<SmoothAnimate className="flex flex-col gap-2">
				<h3 className="text-sm font-medium">Status</h3>

				{/* Strict mode */}
				{!project.docker.isStrict && (
					<StrictMode
						project={project}
						handleDocker={handleDocker}
						loading={loading}
					/>
				)}

				{/* Save project */}
				{!project.docker.isSaved && (
					<SaveProject
						project={project}
						handleDocker={handleDocker}
						loading={loading}
					/>
				)}

				{project.docker.isStrict && project.docker.isSaved && (
					<GoodDockerConfiguration />
				)}
			</SmoothAnimate>

			{/* Table of all containers */}
			<ContainersList
				handleDocker={handleDocker}
				containers={containers}
				loading={loading}
			/>

			{/* Edition of docker compose */}
			{/* Edit current docker-compose (modal from create) */}
			<div className="relative">
				<h3 className="text-sm font-medium mb-2">Docker configuration</h3>
				<DockerConfiguration handleDocker={handleDocker} loading={loading} />
			</div>

			{/* TODO : Logs */}
		</TabsContent>
	);
}

function QuickActions({
	handleDocker,
	containers,
	loading = false,
	timerPercentage,
	project,
}: {
	handleDocker: (action: DockerAction) => Promise<boolean>;
	containers: DockerContainer[];
	loading?: boolean;
	timerPercentage: number;
	project: Project;
}) {
	const containers_running = containers.filter(
		(container) => container.state == "running",
	);
	const percentage = (containers_running.length / containers.length) * 100;

	

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-sm font-medium">Actions</h3>
			<div className="grid gap-2 grid-cols-3">
				<div
					className={`h-auto w-full bg-background flex items-center gap-4 p-4 rounded-lg border ${containers_running.length == 0 ? "hover:!border-destructive/50" : "hover:!border-primary/50"} transition-all duration-200 relative overflow-hidden`}
				>
					<div
						className={`p-2 ${containers_running.length == 0 ? "bg-destructive/10" : "bg-primary/10"} rounded-md`}
					>
						<ChartPie
							className={`h-5 w-5 ${containers_running.length == 0 ? "text-destructive" : "text-primary"} `}
						/>
					</div>
					<div className="flex-1 text-left">
						<div className="font-medium text-foreground text-sm flex  flex-wrap items-center gap-2 gap-y-0 justify-between">
							<span>Containers status</span>
							<div className="text-xs text-muted-foreground">
								{containers.length != 0 ? (
									containers_running.length == containers.length ? (
										<>All containers are running!</>
									) : (
										<>
											({containers_running.length}/{containers.length} running)
										</>
									)
								) : (
									<>No containers found.</>
								)}
							</div>
						</div>
						{containers_running.length != containers.length && (
							<div className="text-xs text-muted-foreground pt-1">
								<Progress className="w-full" value={percentage} />
							</div>
						)}
					</div>
				</div>

				<Button
					type={"button"}
					variant={"outline"}
					onClick={() => {
						handleDocker({ type: "docker-containers-list" });
					}}
					disabled={loading || !project.docker.isSaved}
					className="h-auto w-full flex items-center gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden group"
				>
					<div className="p-2 bg-primary/10 rounded-md">
						<RefreshCcw className="h-5 w-5 text-primary group-hover:-rotate-180 transition-transform duration-300" />
					</div>
					<div className="flex-1 text-left">
						<div className="font-medium text-foreground text-sm flex  flex-wrap items-center gap-2 gap-y-0 justify-between">
							<span>Refresh containers list</span>
							
							<div className="text-xs text-muted-foreground">
								{loading ? (
									<>
										Refreshing...
									</>
								) : (
									<>
										{Math.round((timerPercentage / 100) * 60)} seconds remaining
									</>
								)}
							</div>
						</div>
						{!loading && (
							<div className="text-xs text-muted-foreground pt-1">
								<Progress className="w-full" value={timerPercentage} />
							</div>
						)}
					</div>
				</Button>

				{/* Aggressive prune */}
				<AlertDialog>
					<AlertDialogTrigger asChild>
						{/* Button */}
						<Button
							type={"button"}
							variant={"outline"}
							disabled={loading|| !project.docker.isSaved}
							className="h-auto w-full flex items-center gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
						>
							<div className="p-2 bg-primary/10 rounded-md">
								<Eraser className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 text-left">
								<div className="font-medium text-foreground">Aggressive prune</div>
								{/* <div className="text-xs text-muted-foreground">
									Prune all volumes, networks...
								</div> */}
								<div className="text-xs text-muted-foreground font-mono whitespace-normal">
									docker compose down -v --rmi all --remove-orphans
								</div>
							</div>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="flex items-center gap-2">
								<Eraser className="w-4 h-4 text-destructive" />
								Aggressive prune
							</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to remove all images, containers, volumes and networks by
								running the{" "}
								<Badge variant={"outline"} className="font-mono">
									docker compose down -v --rmi all --remove-orphans
								</Badge>{" "}
								command?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogBody>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
								<AlertDialogAction
									disabled={loading}
									onAction={async () => {
										return await handleDocker({ type: "docker-prune" });
									}}
									variant={"destructive"}
								>
									{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eraser />}
									Prune
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialog>

				{/* Run all containers */}
				<AlertDialog>
					<AlertDialogTrigger asChild>
						{/* Button */}
						<Button
							type={"button"}
							variant={"outline"}
							disabled={loading || !project.docker.isSaved}
							className="h-auto w-full flex gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden items-center"
						>
							<div className="p-2 bg-primary/10 rounded-md">
								<Play className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 text-left">
								<div className="font-medium text-foreground">Run all containers</div>
								<div className="text-xs text-muted-foreground font-mono">
									docker compose up -d
								</div>
							</div>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="flex items-center gap-2">
								<Play className="w-4 h-4 text-primary" />
								Run all containers
							</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to run all containers by running the{" "}
								<Badge variant={"outline"} className="font-mono">
									docker-compose up -d
								</Badge>{" "}
								command?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogBody>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
								<AlertDialogAction
									disabled={loading}
									onAction={async () => {
										return await handleDocker({
											type: "docker-containers-run",
										});
									}}
									variant={"default"}
								>
									{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play />}
									Run
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialog>

				{/* Stop all containers */}
				<AlertDialog>
					<AlertDialogTrigger asChild>
						{/* Button */}
						<Button
							type={"button"}
							variant={"outline"}
							disabled={
								loading || containers_running.length == 0 || containers.length == 0 || !project.docker.isSaved
							}
							className="h-auto w-full flex items-center gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
						>
							<div className="p-2 bg-primary/10 rounded-md">
								<Octagon className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 text-left">
								<div className="font-medium text-foreground">Stop all containers</div>
								<div className="text-xs text-muted-foreground font-mono">
									docker compose stop
								</div>
							</div>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="flex items-center gap-2">
								<Octagon className="w-4 h-4 text-destructive" />
								Stop all containers
							</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to stop all containers by running the{" "}
								<Badge variant={"outline"} className="font-mono">
									docker compose stop
								</Badge>{" "}
								command?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogBody>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
								<AlertDialogAction
									disabled={loading}
									onAction={async () => {
										return await handleDocker({
											type: "docker-containers-stop",
										});
									}}
									variant={"destructive"}
								>
									{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Octagon />}
									Stop
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialog>

				{/* Remove all containers */}
				<AlertDialog>
					<AlertDialogTrigger asChild>
						{/* Button */}
						<Button
							type={"button"}
							variant={"outline"}
							disabled={loading || containers.length == 0 || !project.docker.isSaved}
							className="h-auto w-full flex items-center gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
						>
							<div className="p-2 bg-primary/10 rounded-md">
								<CircleMinus className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 text-left">
								<div className="font-medium text-foreground">Remove all containers</div>
								<div className="text-xs text-muted-foreground font-mono">
									docker compose down
								</div>
							</div>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="flex items-center gap-2">
								<CircleMinus className="w-4 h-4 text-destructive" />
								Remove all containers
							</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to remove all containers by running the{" "}
								<Badge variant={"outline"} className="font-mono">
									docker compose down
								</Badge>{" "}
								command?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogBody>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
								<AlertDialogAction
									disabled={loading}
									onAction={async () => {
										return await handleDocker({
											type: "docker-containers-remove",
										});
									}}
									variant={"destructive"}
								>
									{loading ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<CircleMinus />
									)}
									Remove
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialog>
				
			</div>
		</div>
	);
}

function StrictMode({
	project,
	handleDocker,
	loading = false,
}: {
	project: Project;
	handleDocker: (action: DockerAction) => Promise<boolean>;
	loading?: boolean;
}) {
	return (
		<Alert
			variant={"destructive"}
			className="flex justify-between items-center gap-2"
		>
			<div className="flex justify-between items-center gap-2">
				<AlertCircleIcon className="h-4 w-4" />
				<AlertTitle>
					Since strict mode is disabled in your Docker configuration, the file is not
					validated in any way.
				</AlertTitle>
			</div>
			<Button
				variant={"outline"}
				size={"sm"}
				onClick={() => handleDocker({ type: "docker-strict-toggle" })}
				disabled={loading}
			>
				{loading && <Loader2 className="w-4 h-4 animate-spin" />}
				Enable strict mode
			</Button>
		</Alert>
	);
}

function GoodDockerConfiguration() {
	return (
		<Alert
			variant={"default"}
			className="flex justify-between items-center gap-2"
		>
			<div className="flex justify-between items-center gap-2">
				<Check className="h-4 w-4" />
				<AlertTitle>
					Your Docker configuration is valid and saved. You can now run your
					containers in total safety.
				</AlertTitle>
			</div>
		</Alert>
	);
}

function SaveProject({
	project,
	handleDocker,
	loading = false,
}: {
	project: Project;
	handleDocker: (action: DockerAction) => Promise<boolean>;
	loading?: boolean;
}) {
	return (
		<Alert
			variant={"destructive"}
			className="flex justify-between items-center gap-2"
		>
			<div className="flex justify-between items-center gap-2">
				<AlertCircleIcon className="h-4 w-4" />
				<AlertTitle>
					Your Docker configuration is not saved. Please save it to be able to run your
					containers.
				</AlertTitle>
			</div>
			<Button
				variant={"outline"}
				size={"sm"}
				onClick={async () => {
					await handleDocker({ type: "docker-save" });
				}}
				disabled={loading}
			>
				{loading && <Loader2 className="w-4 h-4 animate-spin" />}
				Save project
			</Button>
		</Alert>
	);
}

export function ContainersList({
	// project,
	handleDocker,
	containers,
	loading = false,
}: {
	// project: Project;
	handleDocker: (action: DockerAction) => Promise<boolean>;
	containers: DockerContainer[];
	loading?: boolean;
}) {
	// States
	const [search, setSearch] = useState<string>("");

	const filteredContainers = containers.filter((container) => {
		const haystack = [
			container.container_id,
			container.image,
			container.created_at,
			container.state,
			container.name,
		]
			.join(" ")
			.toLowerCase();

		return haystack.includes(search.toLowerCase());
	});

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-sm font-medium">Containers</h3>

			<Table>
				<TableHeader className="bg-card">
					<TableRow>
						<TableHead className="sticky left-0 z-1 bg-card after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-border ">
							Name
						</TableHead>
						<TableHead>Image</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>State</TableHead>
						<TableHead>Ports</TableHead>
						<TableHead className="text-center px-4">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="bg-background">
					{filteredContainers.map((container) => (
						<TableRow key={container.container_id}>
							<TableCell className="sticky left-0 z-1 bg-background after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-border">
								{container.name}
							</TableCell>
							<TableCell className="font-mono">
								<Badge variant={"outline"}>{container.image}</Badge>
							</TableCell>
							<TableCell>{container.status}</TableCell>
							<TableCell>{formatContainerState({ state: container.state })}</TableCell>
							<TableCell>
								{formatContainerPort({ mapping: container.ports })}
							</TableCell>
							<TableCell className="text-center">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											type="button"
											className="h-8 px-2"
											disabled={loading}
										>
											<Ellipsis className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="">
										{/* Container */}

										{/* Actions */}
										<DropdownMenuGroup>
											<DropdownMenuItem
												onClick={async () => {
													await handleDocker({
														type: "docker-container-run",
														container_id: container.container_id,
													});
												}}
												className="flex items-center gap-2"
												disabled={container.state == "running"}
											>
												<Play className="h-4 w-4" />
												<span>Run</span>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={async () => {
													await handleDocker({
														type: "docker-container-stop",
														container_id: container.container_id,
													});
												}}
												className="flex items-center gap-2"
												disabled={container.state == "exited"}
											>
												<OctagonMinus className="h-4 w-4" />
												<span>Stop</span>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={async () => {
													await handleDocker({
														type: "docker-container-restart",
														container_id: container.container_id,
													});
												}}
												className="flex items-center gap-2"
												disabled={container.state != "running"}
											>
												<RefreshCcw className="h-4 w-4" />
												<span>Restart</span>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={async () => {
													await handleDocker({
														type: "docker-container-remove",
														container_id: container.container_id,
													});
												}}
												className="flex items-center gap-2"
											>
												<Eraser className="h-4 w-4" />
												<span>Remove</span>
											</DropdownMenuItem>
										</DropdownMenuGroup>

										<DropdownMenuSeparator />

										<DropdownMenuGroup>
											<div className="px-2 py-1.5 space-y-1">
												<div className="flex items-center justify-between gap-2">
													<span className="text-xs text-muted-foreground">ID:</span>
													<span className="text-xs font-mono" title={container.container_id}>
														{container.container_id}
													</span>
												</div>
												<div className="flex items-center justify-between gap-2">
													<span className="text-xs text-muted-foreground">Image:</span>
													<span className="text-xs" title={container.image}>
														{container.image}
													</span>
												</div>
												<div className="flex items-center justify-between gap-2">
													<span className="text-xs text-muted-foreground">Created:</span>
													<span className="text-xs">
														{formatContainerDate({ date: container.created_at })}
													</span>
												</div>
											</div>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}

					{filteredContainers.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={6}
								className="text-center py-4 bg-muted/50 text-muted-foreground"
							>
								No containers added yet. Click on "Run all containers" in the
								"Containers" tab to start them.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
