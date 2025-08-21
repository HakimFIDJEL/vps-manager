// services/docker/factory.ts
import type { DockerService, DockerContainer } from "@/lib/docker/type";
import { useProject } from "@/contexts/project-context";
import { useLocalDockerService } from "@/services/docker/local";
import { useRemoteDockerService } from "@/services/docker/remote";


export function useDockerServiceFactory({ setContainers } : { setContainers: (containers: DockerContainer[]) => void }): DockerService {
  const { project } = useProject();
  return project.isCreated
    ? useRemoteDockerService({ setContainers })
    : useLocalDockerService();
}
