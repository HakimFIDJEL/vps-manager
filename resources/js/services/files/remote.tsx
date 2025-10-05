// services/files/remote.tsx

// Necessary imports
import { toast } from "sonner";
import { useLocalFileService } from "./local";

// Contexts
import { useProject } from "@/contexts/project-context";

// Types
import type { ActionOf } from "@/lib/files/type";
import type { FileService, Registry } from "@/lib/files/type";

export function useRemoteFileService(): FileService {
	const { project, updateProject } = useProject();
	const local = useLocalFileService();

	const registry: Registry = {
		"file-reset-type": local.handleFile,
		"file-git-link": local.handleFile,
	};

	return {
		async handleFile(action) {
			const fn = registry[action.type] as any;
			return fn ? fn(action as any) : true;
		},
	};
}
