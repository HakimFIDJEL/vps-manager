import { createContext, useContext, useState, useCallback } from "react";
import type { DockerAction, DockerService } from "@/lib/docker/type";
import { useDockerServiceFactory } from "@/services/docker/factory";

interface DockerContextType {
  handleDocker: (action: DockerAction) => Promise<boolean>;
  loading: boolean;
}

const DockerContext = createContext<DockerContextType | undefined>(undefined);

export function DockerProvider({ children }: { children: React.ReactNode }) {
  const service: DockerService = useDockerServiceFactory();
  const [loading, setLoading] = useState(false);

  const handleDocker = useCallback(async (action: DockerAction) => {
    setLoading(true);
    try {
      return await service.handleDocker(action);
    } finally {
      setLoading(false);
    }
  }, [service]);

  return (
    <DockerContext.Provider value={{ handleDocker, loading }}>
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
