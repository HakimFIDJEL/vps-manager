// services/docker/factory.ts
import type { DockerService } from "@/lib/docker/type";
import { useProject } from "@/contexts/project-context";
import { useLocalDockerService } from "@/services/docker/local";
import { useRemoteDockerService } from "@/services/docker/remote";

export function useDockerServiceFactory(): DockerService {
  const { project } = useProject();
  console.log(project.isCreated);
  return project.isCreated
    ? useRemoteDockerService()
    : useLocalDockerService();
}
