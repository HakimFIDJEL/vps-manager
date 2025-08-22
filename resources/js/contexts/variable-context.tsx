// contexts/variable-context.tsx

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
