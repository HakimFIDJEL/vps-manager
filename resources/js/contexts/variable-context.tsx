// import { createContext, useCallback, useContext, useState } from "react";
// import { useProject } from "./project-context";
// import { useVariableActionsLocal } from "@/services/variables/local";
// import { useVariableActionsRemote } from "@/services/variables/remote";
// import { type Variable } from "@/lib/variables/type";

// export type VariableAction =
// 	| { type: "create"; variable: Variable }
// 	| { type: "create-multiple"; variables: Variable[] }
// 	| { type: "update"; variable: Variable }
// 	| { type: "delete"; variable: Variable }
// 	| { type: "delete-all" }
// 	| { type: "toggle-visibility"; variable: Variable }
// 	| { type: "toggle-visibility-all" };

// interface VariableContextType {
// 	handleVariableAction: (action: VariableAction) => Promise<void>;
// 	loading: boolean;
// }

// const VariableContext = createContext<VariableContextType | undefined>(
// 	undefined,
// );

// export function VariableProvider({ children }: { children: React.ReactNode }) {
// 	const { project } = useProject();
// 	const [loading, setLoading] = useState(false);

// 	const handleVariableActionImpl = project.isCreated
// 		? useVariableActionsRemote()
// 		: useVariableActionsLocal();

// 	const handleVariableAction = useCallback(
// 		async (action: VariableAction) => {
// 			setLoading(true);
// 			await handleVariableActionImpl(action);
// 			setLoading(false);
// 		},
// 		[handleVariableActionImpl],
// 	);

// 	return (
// 		<VariableContext.Provider value={{ handleVariableAction, loading }}>
// 			{children}
// 		</VariableContext.Provider>
// 	);
// }

// export function useVariable() {
// 	const context = useContext(VariableContext);
// 	if (context === undefined) {
// 		throw new Error("useVariable must be used within a VariableProvider");
// 	}
// 	return context;
// }

import { createContext, useContext, useState, useCallback } from "react";
import type { VariableAction, VariableService } from "@/lib/variables/type";
import { useVariableServiceFactory } from "@/services/variables/factory";

interface VariableContextType {
	handleVariable: (action: VariableAction) => Promise<boolean>;
	loading: boolean;
}

const VariableContext = createContext<VariableContextType | undefined>(undefined);

export function VariableProvider({ children }: { children: React.ReactNode }) {
	const service: VariableService = useVariableServiceFactory();
	const [loading, setLoading] = useState(false);

	const handleVariable = useCallback(
		async (action: VariableAction) => {
			setLoading(true);
			try {
				return await service.handleVariable(action);
			} finally {
				setLoading(false);
			}
		},
		[service],
	);

	return (
		<VariableContext.Provider value={{ handleVariable, loading }}>
			{children}
		</VariableContext.Provider>
	);
}

export function useVariable() {
	const context = useContext(VariableContext);
	if (!context) {
		throw new Error("useVariable must be used within a VariableProvider");
	}
	return context;
}
