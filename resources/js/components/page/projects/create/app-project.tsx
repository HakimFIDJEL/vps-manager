// Necessary imports
import { useEffect, useState } from "react";
import { useProject } from "@/contexts/project-context";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Functions
import { formatSlug } from "@/lib/projects/formatter";
import { Check, Loader2, X } from "lucide-react";

// Types
import { FolderSchema } from "@/lib/projects/type";
type PathState = "" | "loading" | "success" | "error";

export function AppProject() {
	// Custom hooks
	const { project, updateProject } = useProject();

	// States
	const [path, setFolderPath] = useState<string>(project.path);
	const [loading, setLoading] = useState(false);
	const [availabilityState, setAvailabilityState] = useState<PathState>("");

	useEffect(() => {
		setAvailabilityState("");
	}, [path]);

	async function checkPathAvailability(path: string): Promise<boolean> {
		if (loading) return false;

		// No need to check if the path is the same as the current project folder path
		if (!path || path === project.path) {
			setAvailabilityState("");
			return true;
		}

		// Check if it matches the regex
		if (FolderSchema.safeParse({ path }).success === false) {
			setAvailabilityState("");
			return false;
		}

		setAvailabilityState("loading");
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const isAvailable = true;

			setAvailabilityState(isAvailable ? "success" : "error");
			return isAvailable;
		} catch {
			setAvailabilityState("error");
			return false;
		}
	}

	// Hooks
	useEffect(() => {
		if (project.path !== path) {
			updateProject("path", path);
		}
	}, [path]);

	return (
		// Wrapper
		<div className="grid gap-4">
			{/* Form row */}
			<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
				<div className="grid gap-2">
					<Label className="flex items-center gap-2 justify-between">
						<div>Folder path</div>

						{/* State */}
						{availabilityState === "loading" && (
							<div className="flex items-center gap-1">
								<Loader2 className="animate-spin text-muted-foreground h-3 w-3" />
								<span className="text-muted-foreground text-xs">
									Checking availability...
								</span>
							</div>
						)}

						{availabilityState === "success" && (
							<div className="flex items-center gap-1">
								<Check className="text-primary h-3 w-3" />
								<span className="text-primary text-xs">The path is available.</span>
							</div>
						)}

						{availabilityState === "error" && (
							<div className="flex items-center gap-1">
								<X className="text-destructive h-3 w-3" />
								<span className="text-destructive text-xs">
									The path is not available.
								</span>
							</div>
						)}
					</Label>
					<Input
						required={true}
						id={"path"}
						name={"path"}
						readOnly={loading}
						placeholder={"folder-path"}
						autoFocus={true}
						addonText={"/projects/"}
						value={path}
						onChange={(e) => {
							setFolderPath(e.target.value);
						}}
						onBlur={(e) => {
							checkPathAvailability(e.target.value);
						}}
					/>
					<p className="text-xs text-muted-foreground">
						Must be at least 6 characters long and can only contain letters, numbers,
						underscores, and dashes.
					</p>
				</div>
			</div>
		</div>
	);
}
