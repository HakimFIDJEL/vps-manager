import { useProject } from "@/contexts/project-context";
import { toast } from "sonner";
import { type VariableAction } from "@/contexts/variable-context";

export function useVariableActionsLocal() {
  const { project, updateProject } = useProject();

  return async (action: VariableAction): Promise<void> => {
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
  }

} 