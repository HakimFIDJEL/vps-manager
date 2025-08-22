// services/variables/factory.tsx

import { useLocalVariableService } from "@/services/variables/local";
import { useRemoteVariableService } from "@/services/variables/remote";
import { useProject } from "@/contexts/project-context";
import type { VariableService } from "@/lib/variables/type";

export function useVariableServiceFactory(): VariableService {
  const { project } = useProject();
  const local = useLocalVariableService();
  const remote = useRemoteVariableService();
  return project.isCreated ? remote : local;
}
