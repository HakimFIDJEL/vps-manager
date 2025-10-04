// services/files/local.tsx

// Necessary imports
import { toast } from "sonner";
// Contexts
import { useProject } from "@/contexts/project-context";

// Types
import type { ActionOf } from "@/lib/files/type";
import type { FileService, Registry } from "@/lib/files/type";

export function useLocalFileService(): FileService {
	const { project, updateProject } = useProject();

	const registry: Registry = {
		"file-git-link": file_git_link,
	};

	return {
		async handleFile(action) {
			const fn = registry[action.type] as any;
			return fn ? fn(action as any) : true;
		},
	};

	/**
	 * Link a git repository to a project
	 */
	async function file_git_link(a: ActionOf<"file-git-link">) {
		if (a.files.type !== "git") {
			toast.error("An error occured", {
				description: `Invalid file type: ${a.files.type}. Expected 'git'.`,
			});
			return false;
		}
		updateProject("files", a.files);
		toast.success(
			`Git repository ${a.files.git?.repository} successfully linked to the project!`,
		);
		return true;
	}
}
