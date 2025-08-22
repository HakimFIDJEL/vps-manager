import { z } from "zod";

export type Variable = {
	key: string;
	value: string;
	visible?: boolean | null;
};

// Schemas
export const VariableSchema = z.object({
  key: z.string({ message: "The field is required" })
        .regex(/^[A-Z][A-Z0-9_]*$/, { message: "Key must be uppercase and separated by an underscore" }),
  value: z.string({ message: "The field is required" })
        .trim()
        .min(1, { message: "Value is required" })
        // .regex(/^\S+$/, { message: "Value must not contain spaces" }),
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
			message: "Le fichier doit avoir l'extension .env",
		})
		.refine((file) => file.size <= 1024 * 1024, {
			message: "Le fichier ne doit pas dépasser 1 Mo",
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
				message: "Le fichier ne doit pas être vide",
			},
		),
});


export type VariableAction =
	| { type: "variable-create"; variable: Variable }
	| { type: "variable-create-multiple"; variables: Variable[] }
	| { type: "variable-update"; variable: Variable }
	| { type: "variable-delete"; variable: Variable }
	| { type: "variable-delete-all" }
	| { type: "variable-toggle-visibility"; variable: Variable }
	| { type: "variable-toggle-visibility-all" }
	| { type: "variable-export" };

export type ActionOf<T extends VariableAction["type"]> = Extract<
	VariableAction,
	{ type: T }
>;
export type TypedHandler<T extends VariableAction["type"]> = (
	a: ActionOf<T>,
) => Promise<boolean>;
export type Registry = { [K in VariableAction["type"]]?: TypedHandler<K> };

export interface VariableService {
	handleVariable(action: VariableAction): Promise<boolean>;
}
