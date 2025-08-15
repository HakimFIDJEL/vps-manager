// services/variables/factory.ts
import type { VariableService } from "@/lib/variables/type";
import { useProject } from "@/contexts/project-context";
import { useLocalVariableService } from "@/services/variables/local";
import { useRemoteVariableService } from "@/services/variables/remote";

export function useVariableServiceFactory(): VariableService {
	const { project } = useProject();
	return project.isCreated
		? useRemoteVariableService()
		: useLocalVariableService();
}
