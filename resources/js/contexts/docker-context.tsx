// NOTE: The hooks/docker directory and service utility will be created next, so the imports below will resolve after creation.
import { createContext, useContext } from "react";
import { useProject } from "./project-context";
import { useDockerActionsLocal } from "@/services/docker/local";
import { useDockerActionsRemote } from "@/services/docker/remote";
import type { DockerAction } from "@/lib/docker/type";

export type DockerActionHandler = (action: DockerAction) => Promise<void>;

interface DockerContextType {
	handleDockerAction: DockerActionHandler;
}

const DockerContext = createContext<DockerContextType | undefined>(undefined);

export function DockerProvider({ children }: { children: React.ReactNode }) {
	const { project } = useProject();
	const handleDockerAction = project.isCreated
		? useDockerActionsRemote()
		: useDockerActionsLocal();

	return (
		<DockerContext.Provider value={{ handleDockerAction }}>
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
