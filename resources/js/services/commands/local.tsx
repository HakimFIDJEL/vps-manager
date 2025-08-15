// services/commands/local.ts

// Necessary imports
import { toast } from "sonner";
// Contexts
import { useProject } from "@/contexts/project-context";

// Types
import type { ActionOf } from "@/lib/commands/type";
import type { CommandService, Registry } from "@/lib/commands/type";

export function useLocalCommandService(): CommandService {
	const { project, updateProject } = useProject();

	const registry: Registry = {
		"command-create": command_create,
		"command-create-multiple": command_create_multiple,
		"command-update": command_update,
		"command-delete": command_delete,
		"command-delete-all": command_delete_all,
	};

	return {
		async handleCommand(action) {
			const fn = registry[action.type] as any;
			return fn ? fn(action as any) : true;
		},
	};

	async function command_create(a: ActionOf<"command-create">) {
		updateProject("commands", [...project.commands, a.command]);
		toast.success(`Command ${a.command.target} created successfully!`);
		return true;
	}

	async function command_create_multiple(
		a: ActionOf<"command-create-multiple">,
	) {
		updateProject("commands", [...project.commands, ...a.commands]);
		toast.success(`${a.commands.length} commands imported successfully!`);
		return true;
	}

	async function command_update(a: ActionOf<"command-update">) {
		updateProject(
			"commands",
			project.commands.map((c) => (c.target === a.command.target ? a.command : c)),
		);
		toast.success(`Command ${a.command.target} updated successfully!`);
		return true;
	}

	async function command_delete(a: ActionOf<"command-delete">) {
		updateProject(
			"commands",
			project.commands.filter((c) => c.target !== a.command.target),
		);
		toast.success(`Command ${a.command.target} deleted successfully!`);
		return true;
	}

	async function command_delete_all() {
		updateProject("commands", []);
		toast.success("All commands deleted successfully!");
		return true;
	}

	// Server only
	async function command_run(a: ActionOf<"command-run">) {
		toast.loading("Running command...", {
			id: `run-command-${a.command.target}`,
		});
		await new Promise((resolve) => setTimeout(resolve, 2000));
		// TODO : Running command
		toast.dismiss(`run-command-${a.command.target}`);
		toast.success(`Command ran ${a.command.target} successfully!`);
		return true;
	}
}
