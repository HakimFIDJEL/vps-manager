import { z } from "zod";

// Types
export type Project = {
	inode: number;
	name: string;
	folder: string;
	traefik_enabled: boolean;
	updated_at: string;
	created_at: string;
	containers: Container[];
};

export type Container = {
	name: string;
	image: string;
	status: string;
	updated_at: string;
	created_at: string;
};

export type Variable = {
	key: string;
	value: string;
	visible?: boolean | null;
};

// Schemas
export const VariableSchema = z.object({
	key: z
		.string({
			message: "The field is required",
		})
		.regex(/^[A-Z][A-Z0-9_]*$/, {
			message: "Key must be uppercase and separated by an underscore",
		}),
	value: z
		.string({
			message: "The field is required",
		})
		.regex(/^\S+$/, { message: "Value must not contain spaces" }),
});

export const VariableTextSchema = z.object({
	textarea: z
		.string({
			message: "The field is required",
		})
		.refine(
			(text) => {
				const lines = text
					.split("\n")
					.filter((line) => line.trim() !== "" && !line.startsWith("#"));
				return lines.length > 0;
			},
			{
				message: "The text must not be empty",
			},
		)
		.refine(
			(text) => {
				const lines = text
					.split("\n")
					.filter((line) => line.trim() !== "" && !line.startsWith("#"));
				return lines.every((line) => line.match(/^([^=]+)=(.*)$/));
			},
			{
				message: "Invalid format, each line must be in the form KEY=VALUE",
			},
		),
});

export const VariableEnvSchema = z.object({
	file: z
		.instanceof(File)
		.refine((file) => file.name.endsWith(".env"), {
			message: "The file must be a .env file",
		})
		.refine(
			async (file) => {
				const text = await file.text();
				return text.trim().length > 0;
			},
			{
				message: "The file must not be empty",
			},
		),
});
