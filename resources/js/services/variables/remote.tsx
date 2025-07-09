import { useProject } from "@/contexts/project-context";
import { toast } from "sonner";
import { type VariableAction } from "@/contexts/variable-context";

export function useVariableActionsRemote() {
  const { project, updateProject } = useProject();

  return async (action: VariableAction): Promise<void> => {
    switch (action.type) {
      case "create":
        toast.loading("Creating variable...", {
          id: `create-variable-${action.variable.key}`,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateProject("variables", [...project.variables, action.variable]);
        toast.dismiss(`create-variable-${action.variable.key}`);
        toast.success(`Variable ${action.variable.key} created successfully!`);
        break;
      case "create-multiple":
        toast.loading("Importing variables...", {
          id: `import-variables`,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateProject("variables", [...action.variables, ...project.variables]);
        toast.dismiss(`import-variables`);
        toast.success(`${action.variables.length} variables imported successfully!`);
        break;
      case "update":
        toast.loading("Updating variable...", {
          id: `update-variable-${action.variable.key}`,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateProject(
          "variables",
          project.variables.map((v) =>
            v.key === action.variable.key ? action.variable : v
          )
        );
        toast.dismiss(`update-variable-${action.variable.key}`);
        toast.success(`Variable ${action.variable.key} updated successfully!`);
        break;
      case "delete":
        toast.loading("Deleting variable...", {
          id: `delete-variable-${action.variable.key}`,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateProject(
          "variables",
          project.variables.filter((v) => v.key !== action.variable.key)
        );
        toast.dismiss(`delete-variable-${action.variable.key}`);
        toast.success(`Variable ${action.variable.key} deleted successfully!`);
        break;
      case "delete-all":
        toast.loading("Deleting all variables...", {
          id: `delete-all-variables`,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        updateProject("variables", []);
        toast.dismiss(`delete-all-variables`);
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