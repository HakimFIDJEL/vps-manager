// services/files/factory.tsx

import { useLocalFileService } from "@/services/files/local";
import { useRemoteFileService } from "@/services/files/remote";
import { useProject } from "@/contexts/project-context";
import type { FileService } from "@/lib/files/type";

export function useFileServiceFactory(): FileService {
  const { project } = useProject();
  const local = useLocalFileService();
  const remote = useRemoteFileService();
  return project.isCreated ? remote : local;
}
