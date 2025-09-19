// services/docker/factory.tsx

import { useLocalDockerService } from "@/services/docker/local";
import { useRemoteDockerService } from "@/services/docker/remote";
import { useProject } from "@/contexts/project-context";
import type { DockerService, DockerContainer } from "@/lib/docker/type";

export function useDockerServiceFactory({
  containers,
  setContainers,
}: { containers: DockerContainer[]; setContainers: (c: DockerContainer[]) => void }): DockerService {
  const { project } = useProject();
  const local = useLocalDockerService();
  const remote = useRemoteDockerService({ containers, setContainers });
  return project.isCreated ? remote : local;
}
