// services/variables/local.tsx

// Necessary imports
import { toast } from "sonner";
// Contexts
import { useProject } from "@/contexts/project-context";

// Types
import type { ActionOf } from "@/lib/variables/type";
import type { VariableService, Registry } from "@/lib/variables/type";

export function useLocalVariableService(): VariableService {
	const { project, updateProject } = useProject();

	const registry: Registry = {
		"variable-create": variable_create,
		"variable-create-multiple": variable_create_multiple,
		"variable-update": variable_update,
		"variable-delete": variable_delete,
		"variable-delete-all": variable_delete_all,
    "variable-toggle-visibility": variable_toggle_visibility,
    "variable-toggle-visibility-all": variable_toggle_visibility_all,
	};

	return {
		async handleVariable(action) {
			const fn = registry[action.type] as any;
			return fn ? fn(action as any) : true;
		},
	};

	async function variable_create(a: ActionOf<"variable-create">) {
		updateProject("variables", [...project.variables, a.variable]);
		toast.success(`Variable ${a.variable.key} created successfully!`);
		return true;
	}

	async function variable_create_multiple(
		a: ActionOf<"variable-create-multiple">,
	) {
		updateProject("variables", [...project.variables, ...a.variables]);
		toast.success(`${a.variables.length} variables imported successfully!`);
		return true;
	}

	async function variable_update(a: ActionOf<"variable-update">) {
		updateProject(
			"variables",
			project.variables.map((v) => (v.key === a.variable.key ? a.variable : v)),
		);
		toast.success(`Variable ${a.variable.key} updated successfully!`);
		return true;
	}

	async function variable_delete(a: ActionOf<"variable-delete">) {
		updateProject(
			"variables",
			project.variables.filter((v) => v.key !== a.variable.key),
		);
		toast.success(`Variable ${a.variable.key} deleted successfully!`);
		return true;
	}

	async function variable_delete_all() {
		updateProject("variables", []);
		toast.success("All variables deleted successfully!");
		return true;
	}

  async function variable_toggle_visibility(a: ActionOf<"variable-toggle-visibility">) {
    updateProject(
      "variables",
      project.variables.map((v) =>
        v.key === a.variable.key ? { ...v, visible: !v.visible } : v
      )
    );
    return true;
  }

  async function variable_toggle_visibility_all() {
    const allVisible = project.variables.every((v) => v.visible);
    updateProject(
      "variables",
      project.variables.map((v) => ({ ...v, visible: !allVisible }))
    );
    return true;
  }
}
