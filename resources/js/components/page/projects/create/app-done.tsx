import { Badge } from "@/components/ui/badge";
import { Folder, FileLock, Container, SquareTerminal, OctagonMinus } from "lucide-react";
import { useProject } from "@/contexts/project-context";

export function AppDone() {
	const { project } = useProject();

	return (
		<div className="grid grid-cols-2 gap-4">
			{/* Project Info */}
			<div className="p-6 rounded-lg border bg-muted/50 hover:border-primary/50 transition-all duration-200">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/5 rounded-full">
						<Folder className="h-5 w-5 text-primary" />
					</div>
					<div>
						<h4 className="font-medium">{project.name}</h4>
						<p className="text-sm text-muted-foreground">
							/projects/{project.folderPath}
						</p>
					</div>
				</div>
			</div>

			{/* Variables */}
			<div className="p-6 rounded-lg border bg-muted/50 hover:border-primary/50 transition-all duration-200">
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
									{project.variables.length} variable{project.variables.length > 1 ? "s" : ""} configured
								</span>
							)}
						</p>
					</div>
				</div>
			</div>

			{/* Docker */}
			<div className="p-6 rounded-lg border bg-muted/50 hover:border-primary/50 transition-all duration-200">
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
									<OctagonMinus />
									Strict mode disabled
								</Badge>
							)}
						</p>
					</div>
				</div>
			</div>

			{/* Commands */}
			<div className="p-6 rounded-lg border bg-muted/50 hover:border-primary/50 transition-all duration-200">
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
									{project.commands.length} command{project.commands.length > 1 ? "s" : ""} configured
								</span>
							)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
