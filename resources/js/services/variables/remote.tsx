// services/variables/remote.tsx

// Necessary imports
import { toast } from "sonner";

// Services
import { useLocalVariableService } from "./local";

// Contexts
import { useProject } from "@/contexts/project-context";

// Types
import type { ActionOf } from "@/lib/variables/type";
import type { VariableService, Registry } from "@/lib/variables/type";
import { router } from "@inertiajs/react";

export function useRemoteVariableService(): VariableService {
	const { project, updateProject, setProject } = useProject();

	const local = useLocalVariableService();

	const registry: Registry = {
		"variable-create": variable_create,
		"variable-create-multiple": variable_create_multiple,
		"variable-update": variable_update,
		"variable-delete": variable_delete,
		"variable-delete-all": variable_delete_all,
		"variable-toggle-visibility": local.handleVariable,
		"variable-toggle-visibility-all": local.handleVariable,
		"variable-export": variable_export,
	};

	return {
		async handleVariable(action) {
			const fn = registry[action.type] as any;
			return fn ? fn(action as any) : true;
		},
	};

	/**
	 * Create a new variable
	 * 
	 * @param a The action containing the variable data
	 * 
	 * @returns A promise that resolves to a boolean indicating success
	 */
	async function variable_create(a: ActionOf<"variable-create">) {
		const temp_project = {
			...project,
			variables: [...project.variables, a.variable],
		};
		const success_message = `Variable ${a.variable.key} created successfully!`;
		const loading_message = `Creating variable ${a.variable.key}...`;

		return await variable_call({
			temp_project,
			success_message,
			loading_message,
		});
	}

	/**
	 * Create multiple new variables
	 * 
	 * @param a The action containing the variable data
	 * 
	 * @returns A promise that resolves to a boolean indicating success
	 */
	async function variable_create_multiple(
		a: ActionOf<"variable-create-multiple">,
	) {
		const temp_project = {
			...project,
			variables: [...project.variables, ...a.variables],
		};
		const success_message = `${a.variables.length} variables created successfully!`;
		const loading_message = `Creating ${a.variables.length} variables...`;

		return await variable_call({
			temp_project,
			success_message,
			loading_message,
		});
	}

	/**
	 * Update an existing variable
	 * 
	 * @param a The action containing the variable data
	 * 
	 * @returns A promise that resolves to a boolean indicating success
	 */
	async function variable_update(a: ActionOf<"variable-update">) {
		const temp_project = {
			...project,
			variables: project.variables.map((v) =>
				v.key === a.variable.key ? a.variable : v,
			),
		};
		const success_message = `Variable ${a.variable.key} updated successfully!`;
		const loading_message = `Updating variable ${a.variable.key}...`;

		return await variable_call({
			temp_project,
			success_message,
			loading_message,
		});
	}

	/**
	 * Delete an existing variable
	 * 
	 * @param a The action containing the variable data
	 * 
	 * @returns A promise that resolves to a boolean indicating success
	 */
	async function variable_delete(a: ActionOf<"variable-delete">) {
		const temp_project = {
			...project,
			variables: project.variables.filter((v) => v.key !== a.variable.key),
		};
		const success_message = `Variable ${a.variable.key} deleted successfully!`;
		const loading_message = `Deleting variable ${a.variable.key}...`;

		return await variable_call({
			temp_project: temp_project,
			success_message,
			loading_message,
		});
	}

	/**
	 * Delete all existing variables
	 * 
	 * @returns A promise that resolves to a boolean indicating success
	 */
	async function variable_delete_all() {
		const temp_project = {
			...project,
			variables: [],
		};
		const success_message = `All variables deleted successfully!`;
		const loading_message = `Deleting all variables...`;

		return await variable_call({
			temp_project,
			success_message,
			loading_message,
		});
	}

	/**
	 * Handle a variable call
	 * 
	 * @param temp_project 		The temporary project data
	 * @param success_message 	The success message to display
	 * @param loading_message   The loading message to display
	 * @param toast_id          The ID of the toast notification
	 *
	 * @returns A promise that resolves to a boolean indicating success
	 */
	async function variable_call({
		temp_project,
		success_message,
		loading_message,
		toast_id = "variable-call",
	}: {
		temp_project: typeof project;
		loading_message: string;
		success_message: string;
		toast_id?: string;
	}) {
		return await new Promise<boolean>((resolve) => {
			router.post(
				route("projects.variables", { inode: project.inode }),
				{ project: temp_project },
				{
					onStart: () => toast.loading(loading_message, { id: toast_id }),
					onSuccess: () => {
						toast.success(success_message);
						updateProject("variables", temp_project.variables);
						resolve(true);
					},
					onError: (errors: Record<string, any>) => {
						const messages = Object.values(errors).flat();
						toast.error("An error occured", {
							description: messages.join("\n") || "Unknown error",
						});
						resolve(false);
					},
					onFinish: () => toast.dismiss(toast_id),
				},
			);
		});
	}

	/**
	 * Export all variables
	 * 
	 * @returns A promise that resolves to a boolean indicating success
	 */
	async function variable_export() {
		toast.loading("Exporting variables...", { id: "variable-export" });
		try {
			const res = await fetch(
				route("projects.variables_export", { inode: project.inode }),
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

			download_content({
				content: body.content,
				fileName: `.env`,
			});
			toast.success("Variables exported successfully!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("variable-export");
		}
	}

	/**
	 * Download a file
	 * 
	 * @param content 	The content of the file
	 * @param fileName 	The name of the file
	 */
	function download_content({
		content,
		fileName,
	}: {
		content: string;
		fileName: string;
	}) {
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}
