// NOTE: The hooks/docker directory and service utility will be created next, so the imports below will resolve after creation.
import { createContext, useCallback, useContext, useState } from "react";
import { useProject } from "./project-context";
import { useDockerActionsLocal } from "@/services/docker/local";
import { useDockerActionsRemote } from "@/services/docker/remote";
import type { DockerAction } from "@/lib/docker/type";

export type DockerActionHandler = (action: DockerAction) => Promise<void>;

interface DockerContextType {
	handleDockerAction: DockerActionHandler;
	loading: boolean;
}

const DockerContext = createContext<DockerContextType | undefined>(undefined);

export function DockerProvider({ children }: { children: React.ReactNode }) {
	const { project } = useProject();
	const [loading, setLoading] = useState(false);

	const handleDockerActionImpl = project.isCreated
		? useDockerActionsRemote()
		: useDockerActionsLocal();

	const handleDockerAction = useCallback(async (action: DockerAction) => {
		setLoading(true);
		await handleDockerActionImpl(action);
		setLoading(false);
	}, [handleDockerActionImpl]);

	return (
		<DockerContext.Provider value={{ handleDockerAction, loading }}>
			{children}
		</DockerContext.Provider>
	);
}

export function useDocker() {
	const context = useContext(DockerContext);
	if (context === undefined) {
		throw new Error("useDocker must be used within a DockerProvider");
	}
	return context;
}
