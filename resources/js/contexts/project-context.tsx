import { createContext, useContext, useState } from "react";
import { type Project, type ProjectContextType, DEFAULT_PROJECT } from "@/lib/projects/type";
import { CommandProvider } from "./command-context";
import { VariableProvider } from "./variable-context";
import { DockerProvider } from "./docker-context";

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children, projectCreated=false }: { children: React.ReactNode, projectCreated: boolean }) {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);

  const updateProject = <K extends keyof Project>(key: K, value: Project[K]) => {
    setProject(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <ProjectContext.Provider value={{ project, setProject, updateProject }}>
      <CommandProvider projectCreated={projectCreated}>
        <VariableProvider projectCreated={projectCreated}>
          <DockerProvider>
            {children}
          </DockerProvider>
        </VariableProvider>
      </CommandProvider>
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
} 