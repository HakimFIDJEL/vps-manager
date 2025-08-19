// services/docker/remote.tsx

// Necessary imports
import { toast } from "sonner";
import { useLocalDockerService } from "./local";

// Contexts
import { useProject } from "@/contexts/project-context";
import { parseDockerCompose } from "@/lib/docker/parser";

// Types
import type { ActionOf } from "@/lib/docker/type";
import type { DockerService, Registry } from "@/lib/docker/type";
import { router } from "@inertiajs/react";

export function useRemoteDockerService(): DockerService {
	const { project, updateProject } = useProject();
	const local = useLocalDockerService();

	const registry: Registry = {
		"docker-create": docker_create,
		"docker-update": docker_update,
		"docker-delete": docker_delete,
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
	};

	return {
		async handleDocker(action) {
			const fn = registry[action.type] as any;
			return fn ? fn(action as any) : true;
		},
	};

	async function docker_create(a: ActionOf<"docker-create">) {
		updateProject("docker", a.docker);
		toast.success("Docker configuration created successfully!");
		return true;
	}

	async function docker_update(a: ActionOf<"docker-update">) {
		updateProject("docker", a.docker);
		toast.success("Docker configuration updated successfully!");
		return true;
	}

	async function docker_delete() {
		updateProject("docker", {
			content: "",
			isSaved: false,
			isStrict: false,
			parsed: { services: [], volumes: [], networks: [] },
		});
		toast.success("Docker configuration deleted successfully!");
		return true;
	}

	async function docker_save() {
		const r = parseDockerCompose(
			project.docker.content,
			project.docker.isStrict,
			project.variables.length,
		);
		if (!r.isValid || !r.updatedContent) return false;
		updateProject("docker", {
			content: r.updatedContent,
			isSaved: true,
			isStrict: project.docker.isStrict,
			parsed: { services: r.services, volumes: r.volumes, networks: r.networks },
		});
		toast.success("Docker configuration saved successfully!");
		return true;
	}

	async function docker_containers_run() {
		let ok = false;
		await new Promise<void>((resolve) => {
			router.post(
				route("docker.containers.run", { inode: project.inode }),
				{},
				{
					onStart: () =>
						toast.loading("Running all containers...", { id: "run-all" }),
					onSuccess: () => {
						toast.success("All containers running!");
						ok = true;
					},
					onError: (errors: Record<string, string>) =>
						toast.error("An error occured", {
							description: errors.containers_run || "Unknown error",
						}),
					onFinish: () => {
						toast.dismiss("run-all");
						resolve();
					},
				},
			);
		});
		return ok;
	}

	async function docker_containers_stop() {
		let ok = false;
		await new Promise<void>((resolve) => {
			router.post(
				route("docker.containers.stop", { inode: project.inode }),
				{},
				{
					onStart: () => toast.loading("Stopping containers...", { id: "stop-all" }),
					onSuccess: () => {
						toast.success("All containers stopped!");
						ok = true;
					},
					onError: (errors: Record<string, string>) =>
						toast.error("An error occured", {
							description: errors.containers_stop || "Unknown error",
						}),
					onFinish: () => {
						toast.dismiss("stop-all");
						resolve();
					},
				},
			);
		});
		return ok;
	}

	async function docker_containers_remove() {
		let ok = false;
		await new Promise<void>((resolve) => {
			router.post(
				route("docker.containers.remove", { inode: project.inode }),
				{},
				{
					onStart: () => toast.loading("Removing containers...", { id: "rm-all" }),
					onSuccess: () => {
						toast.success("All containers removed!");
						ok = true;
					},
					onError: (errors: Record<string, string>) =>
						toast.error("An error occured", {
							description: errors.containers_remove || "Unknown error",
						}),
					onFinish: () => {
						toast.dismiss("rm-all");
						resolve();
					},
				},
			);
		});
		return ok;
	}

	async function docker_prune() {
		let ok = false;
		await new Promise<void>((resolve) => {
			router.post(
				route("docker.prune", { inode: project.inode }),
				{},
				{
					onStart: () =>
						toast.loading("Removing all containers, networks and volumes...", {
							id: "prune",
						}),
					onSuccess: () => {
						toast.success("All containers, networks and volumes removed!");
						ok = true;
					},
					onError: (errors: Record<string, string>) =>
						toast.error("An error occured", {
							description: errors.docker_prune || "Unknown error",
						}),
					onFinish: () => {
						toast.dismiss("prune");
						resolve();
					},
				},
			);
		});
		return ok;
	}

	async function docker_container_run(a: ActionOf<"docker-container-run">) {
		let ok = false;
		await new Promise<void>((resolve) => {
			router.post(
				route("docker.containers.run.id", {
					inode: project.inode,
					id: a.container_id,
				}),
				{},
				{
					onStart: () => toast.loading("Running container...", { id: "run" }),
					onSuccess: () => {
						toast.success("Container is now running!");
						ok = true;
					},
					onError: (errors: Record<string, string>) =>
						toast.error("An error occured", {
							description: errors.container_run || "Unknown error",
						}),
					onFinish: () => {
						toast.dismiss("run");
						resolve();
					},
				},
			);
		});
		return ok;
	}

	async function docker_container_stop(a: ActionOf<"docker-container-stop">) {
		let ok = false;
		await new Promise<void>((resolve) => {
			router.post(
				route("docker.containers.stop.id", {
					inode: project.inode,
					id: a.container_id,
				}),
				{},
				{
					onStart: () => toast.loading("Stopping container...", { id: "stop" }),
					onSuccess: () => {
						toast.success("Container has been stopped!");
						ok = true;
					},
					onError: (errors: Record<string, string>) =>
						toast.error("An error occured", {
							description: errors.container_stop || "Unknown error",
						}),
					onFinish: () => {
						toast.dismiss("stop");
						resolve();
					},
				},
			);
		});
		return ok;
	}

	async function docker_container_restart(
		a: ActionOf<"docker-container-restart">,
	) {
		let ok = false;
		await new Promise<void>((resolve) => {
			router.post(
				route("docker.containers.restart.id", {
					inode: project.inode,
					id: a.container_id,
				}),
				{},
				{
					onStart: () => toast.loading("Restarting container...", { id: "restart" }),
					onSuccess: () => {
						toast.success("Container has been restarted!");
						ok = true;
					},
					onError: (errors: Record<string, string>) =>
						toast.error("An error occured", {
							description: errors.container_restart || "Unknown error",
						}),
					onFinish: () => {
						toast.dismiss("restart");
						resolve();
					},
				},
			);
		});
		return ok;
	}

	async function docker_container_remove(
		a: ActionOf<"docker-container-remove">,
	) {
		let ok = false;
		await new Promise<void>((resolve) => {
			router.post(
				route("docker.containers.remove.id", {
					inode: project.inode,
					id: a.container_id,
				}),
				{},
				{
					onStart: () => toast.loading("Removing container...", { id: "rm" }),
					onSuccess: () => {
						toast.success("Container has been removed!");
						ok = true;
					},
					onError: (errors: Record<string, string>) =>
						toast.error("An error occured", {
							description: errors.container_remove || "Unknown error",
						}),
					onFinish: () => {
						toast.dismiss("rm");
						resolve();
					},
				},
			);
		});
		return ok;
	}
}
