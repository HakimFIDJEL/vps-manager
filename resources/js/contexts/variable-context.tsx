import { createContext, useContext, useCallback } from "react";
import { toast } from "sonner";
import { useProject } from "./project-context";
import { type Variable } from "@/lib/variables/type";

export type VariableAction = 
  | { type: "create"; variable: Variable }
  | { type: "create-multiple"; variables: Variable[] }
  | { type: "update"; variable: Variable }
  | { type: "delete"; variable: Variable }
  | { type: "delete-all" }
  | { type: "toggle-visibility"; variable: Variable }
  | { type: "toggle-visibility-all" };

interface VariableContextType {
  handleVariableAction: (action: VariableAction) => void;
}

const VariableContext = createContext<VariableContextType | undefined>(undefined);

export function VariableProvider({ children }: { children: React.ReactNode }) {
  const { project, updateProject } = useProject();

  let handleVariableAction: (action: VariableAction) => void;

	// Server actions
	if (project.isCreated) {
    handleVariableAction = useCallback(
      (action: VariableAction) => {
        switch (action.type) {
          case "create":
            updateProject("variables", [...project.variables, action.variable]);
            toast.success(`Variable ${action.variable.key} created successfully!`);
            break;
    
          case "create-multiple":
            updateProject("variables", [...action.variables, ...project.variables]);
            toast.success(`${action.variables.length} variables imported successfully!`);
            break;
    
          case "update":
            updateProject(
              "variables",
              project.variables.map((v) =>
                v.key === action.variable.key ? action.variable : v
              )
            );
            toast.success(`Variable ${action.variable.key} updated successfully!`);
            break;
    
          case "delete":
            updateProject(
              "variables",
              project.variables.filter((v) => v.key !== action.variable.key)
            );
            toast.success(`Variable ${action.variable.key} deleted successfully!`);
            break;
    
          case "delete-all":
            updateProject("variables", []);
            toast.success("All variables deleted successfully!");
            break;
    
          case "toggle-visibility":
            updateProject(
              "variables",
              project.variables.map((v) =>
                v.key === action.variable.key ? { ...v, visible: !v.visible } : v
              )
            );
            break;
    
          case "toggle-visibility-all":
            const allVisible = project.variables.every((v) => v.visible);
            updateProject(
              "variables",
              project.variables.map((v) => ({ ...v, visible: !allVisible }))
            );
            break;
        }
      },
      [project.variables, updateProject],
    );
  } else {
    handleVariableAction = useCallback(
      (action: VariableAction) => {
        switch (action.type) {
          case "create":
            updateProject("variables", [...project.variables, action.variable]);
            toast.success(`Variable ${action.variable.key} created successfully!`);
            break;
    
          case "create-multiple":
            updateProject("variables", [...action.variables, ...project.variables]);
            toast.success(`${action.variables.length} variables imported successfully!`);
            break;
    
          case "update":
            updateProject(
              "variables",
              project.variables.map((v) =>
                v.key === action.variable.key ? action.variable : v
              )
            );
            toast.success(`Variable ${action.variable.key} updated successfully!`);
            break;
    
          case "delete":
            updateProject(
              "variables",
              project.variables.filter((v) => v.key !== action.variable.key)
            );
            toast.success(`Variable ${action.variable.key} deleted successfully!`);
            break;
    
          case "delete-all":
            updateProject("variables", []);
            toast.success("All variables deleted successfully!");
            break;
    
          case "toggle-visibility":
            updateProject(
              "variables",
              project.variables.map((v) =>
                v.key === action.variable.key ? { ...v, visible: !v.visible } : v
              )
            );
            break;
    
          case "toggle-visibility-all":
            const allVisible = project.variables.every((v) => v.visible);
            updateProject(
              "variables",
              project.variables.map((v) => ({ ...v, visible: !allVisible }))
            );
            break;
        }
      },
      [project.variables, updateProject],
    );
  }


  return (
    <VariableContext.Provider value={{ handleVariableAction }}>
      {children}
    </VariableContext.Provider>
  );
}

export function useVariable() {
  const context = useContext(VariableContext);
  if (context === undefined) {
    throw new Error("useVariable must be used within a VariableProvider");
  }
  return context;
} 