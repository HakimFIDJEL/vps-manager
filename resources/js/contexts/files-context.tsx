// contexts/files-context.tsx

import { createContext, useContext, useState, useCallback } from "react";
import type { FileAction, FileService } from "@/lib/files/type";
import { useFileServiceFactory } from "@/services/files/factory";

interface FileContextType {
	handleFile: (action: FileAction) => Promise<boolean>;
	loading: boolean;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FilesProvider({ children }: { children: React.ReactNode }) {
	const service: FileService = useFileServiceFactory();
	const [loading, setLoading] = useState(false);

	const handleFile = useCallback(
		async (action: FileAction) => {
			setLoading(true);
			try {
				return await service.handleFile(action);
			} finally {
				setLoading(false);
			}
		},
		[service],
	);

	return (
		<FileContext.Provider value={{ handleFile, loading }}>
			{children}
		</FileContext.Provider>
	);
}

export function useFile() {
	const context = useContext(FileContext);
	if (!context) {
		throw new Error("useFile must be used within a FilesProvider");
	}
	return context;
}
