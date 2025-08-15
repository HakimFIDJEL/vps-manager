// services/commands/factory.ts
import type { CommandService } from "@/lib/commands/type";
import { useProject } from "@/contexts/project-context";
import { useLocalCommandService } from "@/services/commands/local";
import { useRemoteCommandService } from "@/services/commands/remote";

export function useCommandServiceFactory(): CommandService {
	const { project } = useProject();
	return project.isCreated
		? useRemoteCommandService()
		: useLocalCommandService();
}
