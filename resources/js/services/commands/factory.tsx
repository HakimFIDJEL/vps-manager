// services/commands/factory.tsx

import { useLocalCommandService } from "@/services/commands/local";
import { useRemoteCommandService } from "@/services/commands/remote";
import { useProject } from "@/contexts/project-context";
import type { CommandService } from "@/lib/commands/type";

export function useCommandServiceFactory(): CommandService {
  const { project } = useProject();
  const local = useLocalCommandService();
  const remote = useRemoteCommandService();
  return project.isCreated ? remote : local;
}
