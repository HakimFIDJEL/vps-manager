// Necessary imports
import { useEffect, useState } from "react";
import { useProject } from "@/contexts/project-context";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Functions
import { formatSlug } from "@/lib/projects/formatter";
import { Check, Loader2, X } from "lucide-react";

// Types
import { ProjectSchema } from "@/lib/projects/type";
type PathState = "" | "loading" | "success" | "error";

export function AppProject({
	setValidate,
}: {
	setValidate: Dispatch<SetStateAction<() => Promise<boolean>>>;
}) {
	// Custom hooks
	const { project, updateProject } = useProject();

	// States
	const [path, setFolderPath] = useState<string>(project.path || "");
	const [availabilityState, setAvailabilityState] = useState<PathState>("");

	// Hooks
	useEffect(() => {
		setFolderPath(project.path || "");
	}, [project.path]);

	// Validator
	const validator = async () => {
		// Check if the path matchs the regex
		const result = ProjectSchema.shape.path.safeParse(path);

		if (!result.success) {
			setAvailabilityState("error");
			toast.error(result.error.errors[0].message);
			return false;
		}

		// Check if the path is available
		if (availabilityState !== "success") {
			return await checkPathAvailability(path);
		}

		return true;
	};

	useEffect(() => {
		setValidate(() => validator);
	}, [setValidate, path, availabilityState]);

	// Functions
	async function checkPathAvailability(path: string): Promise<boolean> {
		// TODO : Check if the path is available on the server
		if (false) {
			setAvailabilityState("error");
			return true;
		}

		// If the state is already success, no need to check again
		if (availabilityState === "success") {
			return true;
		}

		// Check if it matches the regex
		if (!ProjectSchema.shape.path.safeParse(path).success) {
			setAvailabilityState("error");
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
						placeholder={"folder-path"}
						autoFocus={true}
						addonText={"/projects/"}
						value={path}
						onChange={(e) => {
							const slug = formatSlug(e.target.value);
							setFolderPath(slug);
							updateProject("path", slug);
						}}
						onBlur={() => checkPathAvailability(path)}
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
