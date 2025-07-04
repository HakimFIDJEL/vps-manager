// Shadcn UI components
import {
	Card,
	CardAction,
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Functions
import {
	formatDate,
	formatTraefik,
	formatContainers,
	formatActions,
} from "@/lib/projects/formatter";

// Types
import { type Project } from "@/lib/projects/type";

export function AppGrid({ projects }: { projects: Project[] }) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{projects.map((project) => (
				<Card key={project.inode} className="gap-0 pt-0">
					<CardHeader className="p-6 bg-muted/50">
						<CardTitle>{project.name}</CardTitle>
						<CardDescription>{project.folder}</CardDescription>
						<CardAction>{formatActions(project.inode)}</CardAction>
					</CardHeader>
					<Separator />
					<CardContent className="grid gap-2 pt-6">
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
			{projects.length === 0 && (
				<Card className="col-span-1 md:col-span-2 lg:col-span-3 h-24 text-center">
					<CardContent className="text-muted-foreground">
						No projects found.
					</CardContent>
				</Card>
			)}
		</div>
	);
}
