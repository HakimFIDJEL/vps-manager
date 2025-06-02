import { createContext, useContext, useState } from "react";
import { type Project, type ProjectContextType, DEFAULT_PROJECT } from "@/lib/projects/type";

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);

  const updateProject = <K extends keyof Project>(key: K, value: Project[K]) => {
    setProject(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <ProjectContext.Provider value={{ project, setProject, updateProject }}>
      {children}
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