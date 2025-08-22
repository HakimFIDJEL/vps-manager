// contexts/command-context.tsx

import { createContext, useContext, useState, useCallback } from "react";
import type { CommandAction, CommandService } from "@/lib/commands/type";
import { useCommandServiceFactory } from "@/services/commands/factory";

interface CommandContextType {
	handleCommand: (action: CommandAction) => Promise<boolean>;
	loading: boolean;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export function CommandProvider({ children }: { children: React.ReactNode }) {
	const service: CommandService = useCommandServiceFactory();
	const [loading, setLoading] = useState(false);

	const handleCommand = useCallback(
		async (action: CommandAction) => {
			setLoading(true);
			try {
				return await service.handleCommand(action);
			} finally {
				setLoading(false);
			}
		},
		[service],
	);

	return (
		<CommandContext.Provider value={{ handleCommand, loading }}>
			{children}
		</CommandContext.Provider>
	);
}

export function useCommand() {
	const context = useContext(CommandContext);
	if (!context) {
		throw new Error("useCommand must be used within a CommandProvider");
	}
	return context;
}
