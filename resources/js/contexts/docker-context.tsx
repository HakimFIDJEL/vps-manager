// contexts/docker-context.tsx

import { createContext, useContext, useState, useCallback } from "react";
import { DockerContainer, type DockerAction, type DockerService } from "@/lib/docker/type";
import { useDockerServiceFactory } from "@/services/docker/factory";

interface DockerContextType {
  handleDocker: (action: DockerAction) => Promise<boolean>;
  loading: boolean;
  containers: DockerContainer[];
  setContainers: React.Dispatch<React.SetStateAction<DockerContainer[]>>;
}

const DockerContext = createContext<DockerContextType | undefined>(undefined);

export function DockerProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const service: DockerService = useDockerServiceFactory({ containers, setContainers });

  const handleDocker = useCallback(async (action: DockerAction) => {
    setLoading(true);
    try {
      return await service.handleDocker(action);
    } finally {
      setLoading(false);
    }
  }, [service]);

  return (
    <DockerContext.Provider value={{ handleDocker, loading, containers, setContainers }}>
      {children}
    </DockerContext.Provider>
  );
}

export function useDocker() {
  const context = useContext(DockerContext);
  if (!context) {
    throw new Error("useDocker must be used within a DockerProvider");
  }
  return context;
}
