import { createContext, useContext, useCallback, ReactNode, useState } from "react";
import { useProject } from "./project-context";
import { type Command } from "@/lib/commands/type";
import { useCommandActionsRemote } from "@/services/commands/remote";
import { useCommandActionsLocal } from "@/services/commands/local";


export type CommandAction =
	| { type: "create"; command: Command }
	| { type: "create-multiple"; commands: Command[] }
	| { type: "update"; command: Command }
	| { type: "delete"; command: Command }
	| { type: "run"; command: Command }
	| { type: "delete-all" };

interface CommandContextType {
	handleCommandAction: (action: CommandAction) => void;
	loading: boolean;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export function CommandProvider({ children }: { children: ReactNode }) {
	const { project } = useProject();
	const [loading, setLoading] = useState(false);


	const handleCommandActionImpl = project.isCreated
		? useCommandActionsRemote()
		: useCommandActionsLocal();

	const handleCommandAction = useCallback(async (action: CommandAction) => {
		setLoading(true);
		await handleCommandActionImpl(action);
		setLoading(false);
	}, [handleCommandActionImpl]);

	return (
		<CommandContext.Provider value={{ handleCommandAction, loading }}>
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
