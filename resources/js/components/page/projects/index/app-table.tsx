// Shadcn ui components
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Functions
import { formatDate, formatSize } from "@/lib/projects/formatter";

// Types
import { type Project } from "@/lib/projects/type";
import { router } from "@inertiajs/react";

export function AppTable({ projects }: { projects: Project[] }) {
	return (
		<Table className="border-0 ">
			<TableHeader>
				<TableRow>
					{/* <TableHead>Inode</TableHead> */}
					<TableHead className="p-4">Path</TableHead>
					<TableHead className="p-4">Inode</TableHead>
					<TableHead className="p-4">Size</TableHead>
					<TableHead className="p-4">Updated At</TableHead>
					<TableHead className="p-4">Created At</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((project) => (
					<TableRow
						className="cursor-pointer"
						key={project.path}
						onClick={() =>
							router.get(route("projects.show", { inode: project.inode }))
						}
					>
						<TableCell className="font-mono p-4">{project.path}</TableCell>
						<TableCell className="font-mono p-4">{project.inode}</TableCell>
						<TableCell className="p-4">{formatSize(project.size)}</TableCell>
						<TableCell className="p-4">{formatDate(project.updated_at)}</TableCell>
						<TableCell className="p-4">{formatDate(project.created_at)}</TableCell>
					</TableRow>
				))}
				{projects.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={5}
							className="text-center py-4 bg-muted/50 text-muted-foreground"
						>
							No projects added yet. Click on "Create a new project" to get started.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
