// Necessary imports
import { useProject } from "@/contexts/project-context";

// Shadcn UI components
import { Badge } from "@/components/ui/badge";

// Icons
import {
	Folder,
	FileLock,
	Container,
	SquareTerminal,
	OctagonMinus,
} from "lucide-react";

export function AppDone() {
	// Custom hooks
	const { project } = useProject();

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-sm font-medium">Overview</h3>

			<div className="grid grid-cols-2 gap-2">
				{/* Project Info */}
				<div className="p-4 rounded-lg border bg-muted/50 hover:border-primary/50 transition-all duration-200 flex items-center">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/5 rounded-full">
							<Folder className="h-5 w-5 text-primary" />
						</div>
						<div>
							<h4 className="font-medium">Folder path</h4>
							<Badge variant={"outline"}>/projects/{project.path}</Badge>
						</div>
					</div>
				</div>

				{/* Variables */}
				<div className="p-4 rounded-lg border bg-muted/50 hover:border-primary/50 transition-all duration-200">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/5 rounded-full">
							<FileLock className="h-5 w-5 text-primary" />
						</div>
						<div>
							<h4 className="font-medium">Environment Variables</h4>
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
				</div>

				{/* Docker */}
				<div className="p-4 rounded-lg border bg-muted/50 hover:border-primary/50 transition-all duration-200">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/5 rounded-full">
							<Container className="h-5 w-5 text-primary" />
						</div>
						<div className="flex flex-col">
							<h4 className="font-medium">Docker Compose</h4>
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
										<OctagonMinus className="h-3 w-3" />
										Strict mode disabled
									</Badge>
								)}
							</p>
						</div>
					</div>
				</div>

				{/* Commands */}
				<div className="p-4 rounded-lg border bg-muted/50 hover:border-primary/50 transition-all duration-200">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary/5 rounded-full">
							<SquareTerminal className="h-5 w-5 text-primary" />
						</div>
						<div>
							<h4 className="font-medium">Makefile Commands</h4>
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
				</div>
			</div>
		</div>
	);
}
