import { toast } from "sonner";
import { z } from "zod";
import { type Variable, VariableSchema } from "@/lib/variables/type";

export function parseVariablesFromEnv({
	content,
	variables,
}: {
	content: string;
	variables: Variable[];
}) {
	const lines = content
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter((l) => l !== "" && !l.startsWith("#"));

	const parsed: Variable[] = [];
	for (const line of lines) {
		const match = line.match(/^\s*([^=]+?)\s*=\s*(.*)$/);
		if (!match) {
			toast.error("An error occured", { description: `Invalid format, line skipped: "${line}"` });
			continue;
		}

		const key = match[1].trim();
		const value = match[2];

		// Utilisation du schéma pour la validation
		const result = VariableSchema.safeParse({ key, value });
		if (!result.success) {
			const errors = result.error.errors.map((err) => err.message).join(", ");
			toast.error("An error occured", { description: `Invalid variable format for ${key}: ${errors}` });
			continue;
		}

		const { key: k, value: v } = result.data; 
		if (variables.some((x) => x.key === k)) {
			toast.error("An error occured", { description: `Key already exists, line skipped: "${key}"` });
			continue;
		}

		parsed.push({ key: k, value: v, visible: false });
	}

	return parsed;
}
