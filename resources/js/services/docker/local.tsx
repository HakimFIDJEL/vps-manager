// services/docker/local.tsx

// Necessary imports
import { toast } from "sonner";
import yaml from "js-yaml";

// Contexts
import { useProject } from "@/contexts/project-context";
import { parseDockerCompose } from "@/lib/docker/parser";

// Types
import type { ActionOf } from "@/lib/docker/type";
import type { DockerService, Registry } from "@/lib/docker/type";

export function useLocalDockerService(): DockerService {
	const { project, updateProject } = useProject();

	const registry: Registry = {
		"docker-create": docker_create,
		"docker-update": docker_update,
		"docker-delete": docker_delete,
		"docker-save": docker_save,
		"docker-un-save": docker_un_save,
		"docker-clear": docker_clear,
		"docker-reset": docker_reset,
		"docker-copy": docker_copy,
		"docker-strict-toggle": docker_strict_toggle,
		"docker-remove-type": docker_remove_type,
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

	async function docker_un_save(a: ActionOf<"docker-un-save">) {
		updateProject("docker", {
			...project.docker,
			content: a.content,
			isSaved: false,
		});
		return true;
	}

	async function docker_clear() {
		const empty = yaml.dump({ services: {}, volumes: {}, networks: {} });
		const r = parseDockerCompose(
			empty,
			project.docker.isStrict,
			project.variables.length,
		);
		if (!r.isValid || !r.updatedContent) return false;
		updateProject("docker", {
			content: r.updatedContent,
			isSaved: false,
			isStrict: project.docker.isStrict,
			parsed: { services: [], volumes: [], networks: [] },
		});
		toast.success("Docker configuration cleared successfully!");
		return true;
	}

	async function docker_reset() {
		return docker_delete();
	}

	async function docker_copy() {
		await navigator.clipboard.writeText(project.docker.content);
		toast.success("Docker configuration copied successfully!");
		return true;
	}

	async function docker_strict_toggle() {
		updateProject("docker", {
			...project.docker,
			isStrict: !project.docker.isStrict,
			isSaved: false,
		});
		return true;
	}

	async function docker_remove_type(a: ActionOf<"docker-remove-type">) {
		const parsed = yaml.load(project.docker.content) as any;
		if (!parsed?.[a.elementType]?.[a.name]) return false;
		if (
			a.elementType === "services" &&
			project.docker.parsed.services.length === 1
		) {
			toast.error("An error occured", {
				description: "At least one service is required",
			});
			return false;
		}
		delete parsed[a.elementType][a.name];
		const r = parseDockerCompose(
			yaml.dump(parsed),
			project.docker.isStrict,
			project.variables.length,
		);
		if (!r.isValid || !r.updatedContent) return false;
		updateProject("docker", {
			content: r.updatedContent,
			isSaved: false,
			isStrict: project.docker.isStrict,
			parsed: { services: r.services, volumes: r.volumes, networks: r.networks },
		});
		toast.success(`${a.elementType.slice(0, -1)} ${a.name} removed`);
		return true;
	}
}
