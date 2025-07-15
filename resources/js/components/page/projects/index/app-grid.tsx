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

// Formatter
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
						<p>Folder path</p>
						<p className="font-mono">{project.path}</p>

						{/* </CardTitle> */}
					</CardHeader>
					<Separator />
					<CardContent className="grid gap-2.5 pt-6">
						<div className="flex items-center justify-between">
							<p className="text-muted-foreground text-sm">Inode</p>
							{/* <Separator className="mx-4 w-auto flex-1" /> */}
							<p className="text-sm">{project.inode}</p>
						</div>
						{/* <Separator /> */}
						<div className="flex items-center justify-between">
							<p className="text-muted-foreground text-sm">Size</p>
							{/* <Separator className="mx-4 w-auto flex-1" /> */}
							<p className="text-sm">{formatSize(project.size)}</p>
						</div>
						{/* <Separator /> */}
						<div className="flex items-center justify-between text-sm">
							<p className="text-muted-foreground text-sm">Updated At</p>
							{/* <Separator className="mx-4 w-auto flex-1" /> */}
							<p className="text-sm">{formatDate(project.updated_at)}</p>
						</div>
						{/* <Separator /> */}
						<div className="flex items-center justify-between text-sm">
							<p className="text-muted-foreground text-sm">Created At</p>
							{/* <Separator className="mx-4 w-auto flex-1" /> */}
							<p className="text-sm">{formatDate(project.created_at)}</p>
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
