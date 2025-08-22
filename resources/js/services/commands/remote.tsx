// services/commands/local.tsx

// Necessary imports
import { toast } from "sonner";
import { router } from "@inertiajs/react";

// Contexts
import { useProject } from "@/contexts/project-context";

// Types
import type { ActionOf } from "@/lib/commands/type";
import type { CommandService, Registry } from "@/lib/commands/type";

export function useRemoteCommandService(): CommandService {
	const { project, updateProject } = useProject();

	const registry: Registry = {
		"command-create": command_create,
		"command-create-multiple": command_create_multiple,
		"command-update": command_update,
		"command-delete": command_delete,
		"command-delete-all": command_delete_all,
		"command-export": command_export,
		"command-run": command_run,
	};

	return {
		async handleCommand(action) {
			const fn = registry[action.type] as any;
			return fn ? fn(action as any) : true;
		},
	};

	/**
	 * Create a new command
	 * 
	 * @param a The action containing the command to create
	 * 
	 * @returns A promise that resolves to true if the command was created successfully
	 */
	async function command_create(a: ActionOf<"command-create">) {
		const temp_project = {
			...project,
			commands: [...project.commands, a.command],
		};
		const loading_message = `Creating command ${a.command.target}...`;
		const success_message = `Command ${a.command.target} created successfully!`;

		return await command_call({
			temp_project,
			loading_message,
			success_message,
		});
	}

	/**
	 * Create multiple new commands
	 * 
	 * @param a The action containing the commands to create
	 * 
	 * @returns A promise that resolves to true if the commands were created successfully
	 */
	async function command_create_multiple(
		a: ActionOf<"command-create-multiple">,
	) {
		const temp_project = {
			...project,
			commands: [...project.commands, ...a.commands],
		};
		const loading_message = `Creating ${a.commands.length} commands...`;
		const success_message = `${a.commands.length} commands created successfully!`;

		return await command_call({
			temp_project,
			loading_message,
			success_message,
		});
	}

	/**
	 * Update an existing command
	 * 
	 * @param a The action containing the command to update
	 * 
	 * @returns A promise that resolves to true if the command was updated successfully
	 */
	async function command_update(a: ActionOf<"command-update">) {
		const temp_project = {
			...project,
			commands: project.commands.map((c) =>
				c.target === a.command.target ? a.command : c,
			),
		};
		const loading_message = `Updating command ${a.command.target}...`;
		const success_message = `Command ${a.command.target} updated successfully!`;

		return await command_call({
			temp_project,
			loading_message,
			success_message,
		});
	}

	/**
	 * Delete an existing command
	 * 
	 * @param a The action containing the command to delete
	 * 
	 * @returns A promise that resolves to true if the command was deleted successfully
	 */
	async function command_delete(a: ActionOf<"command-delete">) {
		const temp_project = {
			...project,
			commands: project.commands.filter((c) => c.target !== a.command.target),
		};
		const loading_message = `Deleting command ${a.command.target}...`;
		const success_message = `Command ${a.command.target} deleted successfully!`;

		return await command_call({
			temp_project,
			loading_message,
			success_message,
		});
	}

	/**
	 * Delete all existing commands
	 * 
	 * @returns A promise that resolves to true if all commands were deleted successfully
	 */
	async function command_delete_all() {
		const temp_project = {
			...project,
			commands: [],
		};
		const loading_message = `Deleting all commands...`;
		const success_message = `All commands deleted successfully!`;

		return await command_call({
			temp_project,
			loading_message,
			success_message,
		});
	}

	/**
	 * Call a command and handle the response
	 * 
	 * @param temp_project 		The temporary project data to send
	 * @param loading_message 	The loading message to display
	 * @param success_message 	The success message to display
	 * @param toast_id 			The ID of the toast to update (optional)
	 * 
	 * @returns A promise that resolves to true if the command was successful
	 */
	async function command_call({
		temp_project,
		success_message,
		loading_message,
		toast_id = "command-call",
	}: {
		temp_project: typeof project;
		loading_message: string;
		success_message: string;
		toast_id?: string;
	}) {
		return await new Promise<boolean>((resolve) => {
			router.post(
				route("projects.commands", { inode: project.inode }),
				{ project: temp_project },
				{
					onStart: () => toast.loading(loading_message, { id: toast_id }),
					onSuccess: () => {
						toast.success(success_message);
						updateProject("commands", temp_project.commands);
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
	 * Export the makefile
	 * 
	 * @returns A promise that resolves to a boolean indicating success
	 */
	async function command_export() {
		toast.loading("Exporting commands...", { id: "command-export" });
		try {
			const res = await fetch(
				route("projects.commands_export", { inode: project.inode }),
				{
					headers: { Accept: "application/json" },
				},
			);

			const body = await res.json().catch(() => null);

			if (!res.ok) {
				const errors = Object.values(body?.errors || {}).flat();
				toast.error("An error occurred", {
					description: errors.join("\n") || "Unknown error",
				});
				return false;
			}

			download_content({
				content: body.content,
				fileName: `Makefile`,
			});
			toast.success("Commands exported successfully!");

			return true;
		} catch (error: any) {
			toast.error("An error occurred", {
				description: error?.message || "Unknown error",
			});
			return false;
		} finally {
			toast.dismiss("command-export");
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

	// Server only
	async function command_run(a: ActionOf<"command-run">) {
		return await new Promise<boolean>((resolve) => {
			router.post(
				route("projects.command_run", { inode: project.inode, command: a.command.target }),
				{  },
				{
					onStart: () => toast.loading("Running command...", { id: "command-run" }),
					onSuccess: () => {
						toast.success(`Command ${a.command.target} ran successfully!`);
						resolve(true);
					},
					onError: (errors: Record<string, any>) => {
						const messages = Object.values(errors).flat();
						toast.error("An error occured", {
							description: messages.join("\n") || "Unknown error",
						});
						resolve(false);
					},
					onFinish: () => toast.dismiss("command-run"),
				},
			);
		});
	}
}
