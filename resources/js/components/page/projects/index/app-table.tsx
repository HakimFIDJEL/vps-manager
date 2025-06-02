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
	formatDate,
	formatTraefik,
	formatContainers,
	formatActions,
} from "@/lib/projects/formatter";

// Types
import { type Project } from "@/lib/projects/type";

export function AppTable({ projects }: { projects: Project[] }) {
	return (
		<Table>
			<TableHeader className="bg-muted/50">
				<TableRow>
					<TableHead>Inode</TableHead>
					<TableHead>Project</TableHead>
					<TableHead>Folder</TableHead>
					<TableHead>Traefik</TableHead>
					<TableHead>Containers</TableHead>
					<TableHead>Updated At</TableHead>
					<TableHead>Created At</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((project) => (
					<TableRow key={project.name}>
						<TableCell className="font-mono">#{project.inode}</TableCell>
						<TableCell>{project.name}</TableCell>
						<TableCell className="font-mono">{project.folder}</TableCell>
						<TableCell>{formatTraefik(project.traefik_enabled)}</TableCell>
						<TableCell>{formatContainers(project.containers)}</TableCell>
						<TableCell>{formatDate(project.updated_at)}</TableCell>
						<TableCell>{formatDate(project.created_at)}</TableCell>
						<TableCell className="text-right">
							{formatActions(project.inode)}
						</TableCell>
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
