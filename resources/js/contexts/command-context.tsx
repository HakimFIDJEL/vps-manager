import { createContext, useContext, useCallback, ReactNode } from "react";
import { toast } from "sonner";
import { useProject } from "./project-context";
import { type Command } from "@/lib/commands/type";

type CommandAction =
	| { type: "create"; command: Command }
	| { type: "create-multiple"; commands: Command[] }
	| { type: "update"; command: Command }
	| { type: "delete"; command: Command }
	| { type: "run"; command: Command }
	| { type: "delete-all" };

interface CommandContextType {
	handleCommandAction: (action: CommandAction) => void;
}

const CommandContext = createContext<CommandContextType | null>(null);

export function CommandProvider({ children }: { children: ReactNode }) {
	const { project, updateProject } = useProject();

	const handleCommandAction = useCallback(
		(action: CommandAction) => {
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
					// Ne rien faire dans create
					break;
			}
		},
		[project.commands, updateProject],
	);

	return (
		<CommandContext.Provider value={{ handleCommandAction }}>
			{children}
		</CommandContext.Provider>
	);
}

export function useCommand() {
	const context = useContext(CommandContext);
	if (!context) {
		throw new Error("useCommand must be used within CommandProvider");
	}
	return context;
} 