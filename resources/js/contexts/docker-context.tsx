import { createContext, useContext, useCallback } from "react";
import { toast } from "sonner";
import { useProject } from "./project-context";
import { type DockerCompose } from "@/lib/docker/type";
import { parseDockerCompose } from "@/lib/docker/parser";
import yaml from "js-yaml";

export type DockerAction =
	| { type: "create"; docker: DockerCompose }
	| { type: "update"; docker: DockerCompose }
	| { type: "delete" }
	| { type: "save" }
	| { type: "clear" }
	| { type: "reset" }
	| { type: "copy" }
	| { type: "strict-toggle" }
	| { type: "un-save"; content: string }
	| { type: "remove-type"; name: string; elementType: "services" | "volumes" | "networks" }
	// Server only
	| { type: "run" }
	| { type: "stop" }
	| { type: "remove" }
	| { type: "prune" }

	| { type: "container-run"; container_id: string }
	| { type: "container-stop"; container_id: string }
	| { type: "container-restart"; container_id: string }
	| { type: "container-remove"; container_id: string }
	;

interface DockerContextType {
	handleDockerAction: (action: DockerAction) => void;
}

const DockerContext = createContext<DockerContextType | undefined>(undefined);

export function DockerProvider({ children }: { children: React.ReactNode }) {
	const { project, updateProject } = useProject();

	let handleDockerAction: (action: DockerAction) => void;

	// Server actions
	if (project.isCreated) {
		handleDockerAction = useCallback(
			(action: DockerAction) => {
				switch (action.type) {
					case "create":
						updateProject("docker", action.docker);
						toast.success("Docker configuration created successfully!");
						break;
		
					case "update":
						updateProject("docker", action.docker);
						toast.success("Docker configuration updated successfully!");
						break;
		
					case "delete":
						updateProject("docker", {
							content: "",
							isSaved: true,
							isStrict: false,
							parsed: {
								services: [],
								volumes: [],
								networks: [],
							},
						});
						toast.success("Docker configuration deleted successfully!");
						break;
		
					case "save":
						const save_parsed = parseDockerCompose(
							project.docker.content,
							project.docker.isStrict,
							project.variables.length
						);
						if (save_parsed.isValid && save_parsed.updatedContent) {
							updateProject("docker", {
								content: save_parsed.updatedContent,
								isSaved: true,
								isStrict: project.docker.isStrict,
								parsed: {
									services: save_parsed.services,
									volumes: save_parsed.volumes,
									networks: save_parsed.networks,
								},
							});
							toast.success("Docker configuration saved");
						}
						break;
		
					case "un-save":
						updateProject("docker", {
							...project.docker,
							content: action.content,
							isSaved: false,
						});
						break;
		
					case "clear":
						const emptyContent = yaml.dump({
							services: {},
							volumes: {},
							networks: {},
						});
						const parsedEmpty = parseDockerCompose(
							emptyContent,
							project.docker.isStrict,
							project.variables.length
						);
						if (parsedEmpty.isValid && parsedEmpty.updatedContent) {
							updateProject("docker", {
								content: parsedEmpty.updatedContent,
								isSaved: false,
								isStrict: project.docker.isStrict,
								parsed: {
									services: [],
									volumes: [],
									networks: [],
								},
							});
							toast.success("Docker configuration cleared");
						}
						break;
		
					case "reset":
						updateProject("docker", {
							content: "",
							isSaved: true,
							isStrict: false,
							parsed: {
								services: [],
								volumes: [],
								networks: [],
							},
						});
						toast.success("Docker configuration reset successfully!");
						break;
		
					case "copy":
						navigator.clipboard.writeText(project.docker.content);
						toast.success("Docker configuration file copied to clipboard");
						break;
		
					case "strict-toggle":
						updateProject("docker", {
							...project.docker,
							isStrict: !project.docker.isStrict,
							isSaved: false,
						});
						toast.success(
							`Strict mode ${!project.docker.isStrict ? "enabled" : "disabled"}`
						);
						break;
		
					case "remove-type":
						const content = project.docker.content;
						const parsed = yaml.load(content) as Record<string, any>;
		
						if (parsed && parsed[action.elementType] && parsed[action.elementType][action.name]) {
							delete parsed[action.elementType][action.name];
							const newContent = yaml.dump(parsed);
							
							// Basic verification to have a custom toast message
							if(action.elementType == "services" && project.docker.parsed.services.length === 1) {
								toast.error('At least one service is required');
								break;
							}
		
							const remove_parsed = parseDockerCompose(
								newContent,
								project.docker.isStrict,
								project.variables.length
							);
		
							if (remove_parsed.isValid && remove_parsed.updatedContent) {
								updateProject("docker", {
									content: remove_parsed.updatedContent,
									isSaved: true,
									isStrict: project.docker.isStrict,
									parsed: {
										services: remove_parsed.services,
										volumes: remove_parsed.volumes,
										networks: remove_parsed.networks,
									},
								});
								toast.success(`${action.elementType.slice(0, -1)} ${action.name} removed successfully!`);
							}
						}
						break;
				
					case "run" :
						toast.info("Running all containers...");
						setTimeout(() => {
							toast.success("All containers are successfully running!");	
						}, 2000);
						break;
					case "stop" :
						toast.info("Stopping all containers...");
						setTimeout(() => {
							toast.success("All containers are successfully stopped!");	
						}, 2000);
						break;
					case "remove" :
						toast.info("Removing all containers...");
						setTimeout(() => {
							toast.success("All containers are successfully removed!");	
						}, 2000);
						break;
					case "prune" :
						toast.info("Pruning...");
						setTimeout(() => {
							toast.success("The system has been successfully pruned!");	
						}, 2000);
						break;
				
					case "container-run" :
						toast.info(`Running container ${action.container_id}...`);
						setTimeout(() => {
							toast.success("Container is successfully running!");	
						}, 2000);
						break;
					case "container-stop" :
						toast.info(`Stopping container ${action.container_id}...`);
						setTimeout(() => {
							toast.success("Container is successfully stopped!");	
						}, 2000);
						break;
					case "container-restart" :
						toast.info(`Restarting container ${action.container_id}...`);
						setTimeout(() => {
							toast.success("Container is successfully restarting!");	
						}, 2000);
						break;
					case "container-remove" :
						toast.info(`Removing container ${action.container_id}...`);
						setTimeout(() => {
							toast.success("Container is successfully removing!");	
						}, 2000);
						break;
				
				}
			}, [project, updateProject]
		);
	} else {
		handleDockerAction = useCallback(
			(action: DockerAction) => {
				switch (action.type) {
					case "create":
						updateProject("docker", action.docker);
						toast.success("Docker configuration created successfully!");
						break;
		
					case "update":
						updateProject("docker", action.docker);
						toast.success("Docker configuration updated successfully!");
						break;
		
					case "delete":
						updateProject("docker", {
							content: "",
							isSaved: true,
							isStrict: false,
							parsed: {
								services: [],
								volumes: [],
								networks: [],
							},
						});
						toast.success("Docker configuration deleted successfully!");
						break;
		
					case "save":
						const save_parsed = parseDockerCompose(
							project.docker.content,
							project.docker.isStrict,
							project.variables.length
						);
						if (save_parsed.isValid && save_parsed.updatedContent) {
							updateProject("docker", {
								content: save_parsed.updatedContent,
								isSaved: true,
								isStrict: project.docker.isStrict,
								parsed: {
									services: save_parsed.services,
									volumes: save_parsed.volumes,
									networks: save_parsed.networks,
								},
							});
							toast.success("Docker configuration saved");
						}
						break;
		
					case "un-save":
						updateProject("docker", {
							...project.docker,
							content: action.content,
							isSaved: false,
						});
						break;
		
					case "clear":
						const emptyContent = yaml.dump({
							services: {},
							volumes: {},
							networks: {},
						});
						const parsedEmpty = parseDockerCompose(
							emptyContent,
							project.docker.isStrict,
							project.variables.length
						);
						if (parsedEmpty.isValid && parsedEmpty.updatedContent) {
							updateProject("docker", {
								content: parsedEmpty.updatedContent,
								isSaved: false,
								isStrict: project.docker.isStrict,
								parsed: {
									services: [],
									volumes: [],
									networks: [],
								},
							});
							toast.success("Docker configuration cleared");
						}
						break;
		
					case "reset":
						updateProject("docker", {
							content: "",
							isSaved: true,
							isStrict: false,
							parsed: {
								services: [],
								volumes: [],
								networks: [],
							},
						});
						toast.success("Docker configuration reset successfully!");
						break;
		
					case "copy":
						navigator.clipboard.writeText(project.docker.content);
						toast.success("Docker configuration file copied to clipboard");
						break;
		
					case "strict-toggle":
						updateProject("docker", {
							...project.docker,
							isStrict: !project.docker.isStrict,
							isSaved: false,
						});
						toast.success(
							`Strict mode ${!project.docker.isStrict ? "enabled" : "disabled"}`
						);
						break;
		
					case "remove-type":
						const content = project.docker.content;
						const parsed = yaml.load(content) as Record<string, any>;
		
						if (parsed && parsed[action.elementType] && parsed[action.elementType][action.name]) {
							delete parsed[action.elementType][action.name];
							const newContent = yaml.dump(parsed);
							
							// Basic verification to have a custom toast message
							if(action.elementType == "services" && project.docker.parsed.services.length === 1) {
								toast.error('At least one service is required');
								break;
							}
		
							const remove_parsed = parseDockerCompose(
								newContent,
								project.docker.isStrict,
								project.variables.length
							);
		
							if (remove_parsed.isValid && remove_parsed.updatedContent) {
								updateProject("docker", {
									content: remove_parsed.updatedContent,
									isSaved: true,
									isStrict: project.docker.isStrict,
									parsed: {
										services: remove_parsed.services,
										volumes: remove_parsed.volumes,
										networks: remove_parsed.networks,
									},
								});
								toast.success(`${action.elementType.slice(0, -1)} ${action.name} removed successfully!`);
							}
						}
						break;
				}
			}, [project, updateProject]
		);
	}

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
