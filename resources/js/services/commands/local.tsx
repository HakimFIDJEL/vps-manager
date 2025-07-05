import { useProject } from "@/contexts/project-context";
import { toast } from "sonner";
import { type CommandAction } from "@/contexts/command-context";

export function useCommandActionsLocal() {
	const { project, updateProject } = useProject();

	return async (action: CommandAction): Promise<void> => {
		switch (action.type) {
			case "create":
				updateProject("commands", [...project.commands, action.command]);
				toast.success(`Command ${action.command.target} created successfully!`);
				break;
			case "create-multiple":
				updateProject("commands", [...project.commands, ...action.commands]);
				toast.success(`${action.commands.length} commands imported successfully!`);
				break;
			case "update":
				updateProject(
					"commands",
					project.commands.map((c) =>
						c.target === action.command.target ? action.command : c,
					),
				);
				toast.success(`Command ${action.command.target} updated successfully!`);
				break;
			case "delete":
				updateProject(
					"commands",
					project.commands.filter((c) => c.target !== action.command.target),
				);
				toast.success(`Command ${action.command.target} deleted successfully!`);
				break;
			case "delete-all":
				updateProject("commands", []);
				toast.success("All commands deleted successfully!");
				break;
			case "run":
				toast.info("Running command...");
				await new Promise((resolve) => setTimeout(resolve, 2000));
				// TODO : Running command
				toast.success(`Command ran ${action.command.target} successfully!`);
				break;
		}
	};
}
