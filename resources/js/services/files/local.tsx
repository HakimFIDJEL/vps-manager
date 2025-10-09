// services/files/local.tsx

// Necessary imports
import { toast } from "sonner";
// Contexts
import { useProject } from "@/contexts/project-context";

// Types
import type { ActionOf, Files } from "@/lib/files/type";
import type { FileService, Registry } from "@/lib/files/type";

export function useLocalFileService(): FileService {
	const { project, updateProject } = useProject();

	const registry: Registry = {
		"file-reset-type": file_reset_type,
		"file-git-link": file_git_link,
		"file-import-upload": file_import_upload,
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

	/**
	 * Reset type for project files
	 */
	async function file_reset_type(a: ActionOf<"file-reset-type">) {
		if (project.files.type === "none") {
			toast.error("An error occured", {
				description: `Invalid file type: ${project.files.type}. Expected 'git' or 'import'.`,
			});
			return false;
		}

		updateProject("files", { type: "none" });

		toast.success(`Project files import type reset successfully!`);
		return true;
	}

	/**
	 * Import a file from local computer
	 */
	async function file_import_upload(a: ActionOf<"file-import-upload">) {
		updateProject("files", { type: "import", import: { file: a.file } });

		toast.success(`File ${a.file.name} successfully uploaded!`);

		return true;
	}
}
