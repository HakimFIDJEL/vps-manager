import { z } from "zod";

export type Command = {
	target: string;
	description: string;
	command: string;
};

// Schemas
export const CommandSchema = z.object({
	target: z
		.string({
			message: "The target is required",
		})
		.regex(/^[a-z_][a-z0-9_]*$/, {
			message:
				"Must start with a lowercase letter or underscore, and can only contain lowercase letters, numbers and underscores.",
		}),
	description: z
		.string({
			message: "The description is required",
		})
		.nonempty("The description is required"),
	command: z
		.string({
			message: "The command is required",
		})
		.nonempty("The command is required"),
});

export const MakefileTextSchema = z.object({
	textarea: z
		.string({
			message: "The field is required",
		})
		.refine(
			(text) => {
				const lines = text.split("\n").filter((line) => line.trim() !== "");
				return lines.length > 0;
			},
			{
				message: "The text must not be empty",
			},
		)
		.refine(
			(text) => {
				const lines = text.split("\n").filter((line) => line.trim() !== "");
				return lines.some((line) => line.match(/^[a-z_][a-z0-9_]*:/));
			},
			{
				message:
					"No valid target found in the text. Targets must be in the form 'target:'",
			},
		),
});

export const MakefileSchema = z.object({
	file: z
		.instanceof(File)
		.refine(
			(file) => file.name.endsWith("Makefile") || file.name.endsWith(".mk"),
			{
				message: "The file must be called Makefile or have the .mk extension",
			},
		)
		.refine((file) => file.size <= 1024 * 1024, {
			message: "The file must not exceed 1 MB",
		})
		.refine(
			async (file) => {
				try {
					const text = await file.text();
					return text.trim().length > 0;
				} catch (error) {
					return false;
				}
			},
			{
				message: "The file must not be empty",
			},
		),
});

export type CommandAction =
	| { type: "command-create"; command: Command }
	| { type: "command-create-multiple"; commands: Command[] }
	| { type: "command-update"; command: Command }
	| { type: "command-delete"; command: Command }
	| { type: "command-delete-all" }
	// Server only
	| { type: "command-run"; command: Command };

export type ActionOf<T extends CommandAction["type"]> = Extract<
	CommandAction,
	{ type: T }
>;
export type TypedHandler<T extends CommandAction["type"]> = (
	a: ActionOf<T>,
) => Promise<boolean>;
export type Registry = { [K in CommandAction["type"]]?: TypedHandler<K> };

export interface CommandService {
	handleCommand(action: CommandAction): Promise<boolean>;
}
