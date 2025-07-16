import { useProject } from "@/contexts/project-context";
import { toast } from "sonner";
import { type CommandAction } from "@/contexts/command-context";

export function useCommandActionsRemote() {
	const { project, updateProject } = useProject();

	return async (action: CommandAction): Promise<void> => {
		switch (action.type) {
			case "create":
				toast.loading("Creating command...", {
					id: `create-command-${action.command.target}`,
				});
				await new Promise((resolve) => setTimeout(resolve, 2000));
				updateProject("commands", [...project.commands, action.command]);
				toast.dismiss(`create-command-${action.command.target}`);
				toast.success(`Command ${action.command.target} created successfully!`);
				break;
			case "create-multiple":
				toast.loading("Importing commands...", {
					id: "import-commands",
				});
				await new Promise((resolve) => setTimeout(resolve, 2000));
				updateProject("commands", [...project.commands, ...action.commands]);
				toast.dismiss("import-commands");
				toast.success(`${action.commands.length} commands imported successfully!`);
				break;
			case "update":
				toast.loading("Updating command...", {
					id: `update-command-${action.command.target}`,
				});
				await new Promise((resolve) => setTimeout(resolve, 2000));
				updateProject(
					"commands",
					project.commands.map((c) =>
						c.target === action.command.target ? action.command : c,
					),
				);
				toast.dismiss(`update-command-${action.command.target}`);
				toast.success(`Command ${action.command.target} updated successfully!`);
				break;
			case "delete":
				toast.loading("Deleting command...", {
					id: `delete-command-${action.command.target}`,
				});
				await new Promise((resolve) => setTimeout(resolve, 2000));
				updateProject(
					"commands",
					project.commands.filter((c) => c.target !== action.command.target),
				);
				toast.dismiss(`delete-command-${action.command.target}`);
				toast.success(`Command ${action.command.target} deleted successfully!`);
				break;
			case "delete-all":
				toast.loading("Deleting commands...", {
					id: "delete-commands",
				});
				await new Promise((resolve) => setTimeout(resolve, 2000));
				updateProject("commands", []);
				toast.dismiss("delete-commands");
				toast.success("All commands deleted successfully!");
				break;
			case "run":
				toast.loading("Running command...", {
					id: `run-command-${action.command.target}`,
				});
				await new Promise((resolve) => setTimeout(resolve, 2000));
				// TODO : Running command
				toast.dismiss(`run-command-${action.command.target}`);
				toast.success(`Command ${action.command.target} ran successfully!`);
				break;
		}
	};
}
