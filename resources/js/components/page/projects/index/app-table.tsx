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
import {
	formatActions,
	formatDate,
	formatSize,
} from "@/lib/projects/formatter";

// Types
import { type Project } from "@/lib/projects/type";
import { Link, router } from "@inertiajs/react";

export function AppTable({ projects }: { projects: Project[] }) {
	return (
		<Table>
			<TableHeader className="bg-muted/50">
				<TableRow>
					{/* <TableHead>Inode</TableHead> */}
					<TableHead>Folder path</TableHead>
					<TableHead>Inode</TableHead>
					<TableHead>Size</TableHead>
					<TableHead>Updated At</TableHead>
					<TableHead>Created At</TableHead>
					<TableHead className="text-center">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((project) => (
					<TableRow key={project.path}>
						<TableCell className="font-mono">{project.path}</TableCell>
						<TableCell className="font-mono">{project.inode}</TableCell>
						<TableCell>{formatSize(project.size)}</TableCell>
						<TableCell>{formatDate(project.updated_at)}</TableCell>
						<TableCell>{formatDate(project.created_at)}</TableCell>
						<TableCell>{formatActions(project.inode, "full", "sm")}</TableCell>
					</TableRow>
				))}
				{projects.length === 0 && (
					<TableRow className="h-24 text-center">
						<TableCell colSpan={8} className="text-muted-foreground">
							No projects found.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
