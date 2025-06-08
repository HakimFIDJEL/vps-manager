// Necessary imports
import { useProject } from "@/contexts/project-context";
import { Link } from "@inertiajs/react";

// Shadcn UI components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

// Icons
import {
	Folder,
	FileLock,
	Container,
	SquareTerminal,
	OctagonMinus,
	ArrowRight,
} from "lucide-react";

export function AppOverview() {
	const { project } = useProject();

	return (
		<TabsContent value="overview" className="flex flex-col gap-6">
			{/* Overview */}

			<div className="flex flex-col gap-2">
				<h3 className="text-sm font-medium">Overview</h3>

				<TabsList className="grid grid-cols-2 gap-4 !bg-transparent border-0 shadow-none rounded-none w-full text-foreground h-auto">
					{/* Project Info */}
					<div className="p-6 rounded-lg border bg-card hover:border-primary/50 transition-all duration-200 group relative">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/5 rounded-full">
								<Folder className="h-4 w-4 text-primary" />
							</div>
							<div>
								<h4 className="font-medium">Project information</h4>
								<div className="flex items-center gap-2">
									<Badge variant={"outline"}>
										{project.name == "" ? "Untitled Project" : project.name}
									</Badge>
									<Badge variant={"outline"}>{project.folderPath}</Badge>
								</div>
							</div>
						</div>
						<ArrowRight className="h-4 w-4 text-primary opacity-0 absolute top-4 right-6 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
					</div>

					{/* Variables */}
					<TabsTrigger
						className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 !transition-all duration-200 group relative justify-start text-start"
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
						className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 !transition-all duration-200 group relative justify-start text-start"
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
						className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 !transition-all duration-200 group relative justify-start text-start"
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

			{/* Stats of the directory */}

			{/* Commands to run carrousel */}

			<div className="flex flex-col gap-2">
				<h3 className="text-sm font-medium">Commands</h3>

				{project.commands.length === 0 ? (
					<div className="flex items-center justify-center border border-border border-dashed rounded-md p-4 bg-muted/50">
						<p className="text-sm text-muted-foreground">
							No commands added yet. Try adding some in the Commands tab.
						</p>
					</div>
				) : (

					<></>

					// <Carousel className="w-full">
					// 	<CarouselContent className="-ml-1">
					// 		{project.commands.map((command) => (
					// 			<div
					// 				key={command.target}
					// 				className="group relative rounded-md border border-border bg-card p-4 transition-all hover:border-primary/50 "
					// 			>
					// 				<div className="flex items-start justify-between gap-2">
					// 					<div>
					// 						<p className="font-mono">{command.target}</p>
					// 						<p className="text-sm text-muted-foreground mt-1">
					// 							{command.description}
					// 						</p>
					// 					</div>
					// 					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					// 						{/* <EditCommand
					// 							command={command}
					// 							commands={commands}
					// 							setCommands={setCommands}
					// 						/>
					// 						<Button
					// 							variant="ghost"
					// 							size="icon"
					// 							onClick={() => handleDelete(command.target)}
					// 							type="button"
					// 						>
					// 							<Trash className="h-4 w-4 text-muted-foreground" />
					// 						</Button> */}
					// 					</div>
					// 				</div>
					// 			</div>
					// 		))}
					// 	</CarouselContent>
					// 	{/* <CarouselPrevious />
					// 	<CarouselNext /> */}
					// </Carousel>
				)}

			</div>
		</TabsContent>
	);
}
