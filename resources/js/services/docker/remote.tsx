// services/docker/remote.tsx

// Necessary imports
import { toast } from "sonner";
import { useLocalDockerService } from "./local";

// Contexts
import { useProject } from "@/contexts/project-context";
import { useDocker } from "@/contexts/docker-context";
import { parseDockerCompose } from "@/lib/docker/parser";

// Types
import type { ActionOf, DockerContainer } from "@/lib/docker/type";
import type { DockerService, Registry } from "@/lib/docker/type";
import { router } from "@inertiajs/react";

export function useRemoteDockerService({
	setContainers,
}: {
	setContainers: (containers: DockerContainer[]) => void;
}): DockerService {
	const { project, updateProject } = useProject();
	const local = useLocalDockerService();

	const registry: Registry = {
		"docker-create": local.handleDocker,
		"docker-update": local.handleDocker,
		"docker-delete": local.handleDocker,
		"docker-save": docker_save,
		"docker-un-save": local.handleDocker,
		"docker-clear": local.handleDocker,
		"docker-copy": local.handleDocker,
		"docker-strict-toggle": local.handleDocker,
		"docker-remove-type": local.handleDocker,
		"docker-prune": docker_prune,
		"docker-containers-run": docker_containers_run,
		"docker-containers-stop": docker_containers_stop,
		"docker-containers-remove": docker_containers_remove,
		"docker-container-run": docker_container_run,
		"docker-container-stop": docker_container_stop,
		"docker-container-restart": docker_container_restart,
		"docker-container-remove": docker_container_remove,
		"docker-containers-list": docker_containers_list,
	};

	return {
		async handleDocker(action) {
			const fn = registry[action.type] as any;
			return fn ? fn(action as any) : true;
		},
	};

	/**
	 * Save the current Docker configuration
	 * 
	 * @returns 	Whether the operation was successful
	 */
	async function docker_save() {
		const r = parseDockerCompose(
			project.docker.content,
			project.docker.isStrict,
			project.variables.length,
		);
		if (!r.isValid || !r.updatedContent) return false;

		const payload = {
			...project,
			docker: {
				...project.docker,
				content: r.updatedContent,
				isSaved: true,
				isStrict: project.docker.isStrict,
				parsed: { services: r.services, volumes: r.volumes, networks: r.networks },
			},
		};

		return await new Promise<boolean>((resolve) => {
			router.post(
				route("projects.docker", { inode: project.inode }),
				{ project: payload },
				{
					onStart: () =>
						toast.loading("Saving Docker configuration...", { id: "docker-save" }),
					onSuccess: () => {
						toast.success("Docker configuration saved successfully!");
						updateProject("docker", payload.docker);
						setContainers([]);
						resolve(true);
					},
					onError: (errors: Record<string, any>) => {
						const messages = Object.values(errors).flat();
						toast.error("An error occured", {
							description: messages.join("\n") || "Unknown error",
						});
						resolve(false);
					},
					onFinish: () => toast.dismiss("docker-save"),
				},
			);
		});
	}

	/**
	 * Run all Docker containers
	 *
	 * @param a The action containing the setContainers function
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_containers_run(
		a: ActionOf<"docker-containers-run">,
	): Promise<boolean> {
		toast.loading("Running all containers...", { id: "run-all" });
		try {
			const res = await fetch(
				route("docker.containers.run", { inode: project.inode }),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.containers_run ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("All containers running!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("run-all");
		}
	}

	/**
	 * Stop all Docker containers
	 *
	 * @param a The action containing the setContainers function
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_containers_stop(
		a: ActionOf<"docker-containers-stop">,
	): Promise<boolean> {
		toast.loading("Stopping all containers...", { id: "stop-all" });
		try {
			const res = await fetch(
				route("docker.containers.stop", { inode: project.inode }),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.containers_stop ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("All containers stopped!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("stop-all");
		}
	}

	/**
	 * Remove all Docker containers
	 *
	 * @param a The action containing the setContainers function
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_containers_remove(
		a: ActionOf<"docker-containers-remove">,
	): Promise<boolean> {
		toast.loading("Removing all containers...", { id: "rm-all" });
		try {
			const res = await fetch(
				route("docker.containers.remove", { inode: project.inode }),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.containers_remove ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("All containers removed!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("rm-all");
		}
	}

	/**
	 * Prune unused Docker objects
	 *
	 * @param a The action containing the setContainers function
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_prune(a: ActionOf<"docker-prune">): Promise<boolean> {
		toast.loading("Removing all containers, networks and volumes...", {
			id: "prune",
		});
		try {
			const res = await fetch(route("docker.prune", { inode: project.inode }), {
				headers: { Accept: "application/json" },
			});

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.docker_prune ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("All containers, networks and volumes removed!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("prune");
		}
	}

	/**
	 * Run a Docker container
	 *
	 * @param a The action containing the container ID
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_container_run(
		a: ActionOf<"docker-container-run">,
	): Promise<boolean> {
		toast.loading("Running container...", { id: "run" });
		try {
			const res = await fetch(
				route("docker.containers.run.id", {
					inode: project.inode,
					id: a.container_id,
				}),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.container_run ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("Container is now running!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("run");
		}
	}

	/**
	 * Stop a Docker container
	 *
	 * @param a The action containing the container ID
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_container_stop(
		a: ActionOf<"docker-container-stop">,
	): Promise<boolean> {
		toast.loading("Stopping container...", { id: "stop" });
		try {
			const res = await fetch(
				route("docker.containers.stop.id", {
					inode: project.inode,
					id: a.container_id,
				}),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.container_stop ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("Container has been stopped!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("stop");
		}
	}

	/**
	 * Restart a Docker container
	 *
	 * @param a The action containing the container ID
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_container_restart(
		a: ActionOf<"docker-container-restart">,
	): Promise<boolean> {
		toast.loading("Restarting container...", { id: "restart" });
		try {
			const res = await fetch(
				route("docker.containers.restart.id", {
					inode: project.inode,
					id: a.container_id,
				}),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.container_restart ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("Container has been restarted!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("restart");
		}
	}

	/**
	 * Remove a Docker container
	 *
	 * @param a The action containing the container ID
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_container_remove(
		a: ActionOf<"docker-container-remove">,
	): Promise<boolean> {
		toast.loading("Removing container...", { id: "rm" });
		try {
			const res = await fetch(
				route("docker.containers.remove.id", {
					inode: project.inode,
					id: a.container_id,
				}),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.container_remove ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("Container has been removed!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("rm");
		}
	}

	/**
	 * Fetch a list of Docker containers
	 *
	 * @param a The action containing the setContainers function
	 * 
	 * @returns Whether the operation was successful
	 */
	async function docker_containers_list(a: ActionOf<"docker-containers-list">) {
		toast.loading("Refreshing containers...", { id: "containers-list" });
		try {
			const res = await fetch(
				route("docker.containers.list", { inode: project.inode }),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				toast.error("An error occurred", {
					description: body?.errors?.containers_list ?? "Unknown error",
				});
				return false;
			}

			setContainers(body?.containers ?? []);
			toast.success("Containers have been refreshed!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("containers-list");
		}
	}
}
