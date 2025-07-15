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
import { Separator } from "@/components/ui/separator";

// Functions
import {
	formatDate,
	formatSize,
	formatActions,
} from "@/lib/projects/formatter";

// Types
import { type Project } from "@/lib/projects/type";

export function AppGrid({ projects }: { projects: Project[] }) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{projects.map((project) => (
				<Card key={project.inode} className="gap-0 pt-0">
					<CardHeader className="p-6 bg-muted/50 font-medium flex justify-between">
						{/* <CardTitle className="font-mono font-medium "> */}
						<p>Path</p>
						<p className="font-mono">{project.path}</p>

						{/* </CardTitle> */}
					</CardHeader>
					<Separator />
					<CardContent className="grid gap-2 pt-6">
						<div className="flex items-center justify-between">
							<p>Inode</p>
							<p className="font-mono">#{project.inode}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>Size</p>
							{formatSize(project.size)}
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
					<Separator />
					<CardFooter>{formatActions(project.inode, "full")}</CardFooter>
				</Card>
			))}
			{projects.length === 0 && (
				<Card className="col-span-1 md:col-span-2 lg:col-span-3">
					<CardContent className="text-center py-4 bg-muted/50 text-muted-foreground text-sm">
						No projects added yet. Click on "Create a new project" to get started.
					</CardContent>
				</Card>
			)}
		</div>
	);
}
