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
      toast.error(`Invalid format, line skipped: "${line}"`);
      continue;
    }

    const key = match[1].trim();
    const value = match[2];

    // Utilisation du schéma pour la validation
    const result = VariableSchema.safeParse({ key, value });
    if (!result.success) {
      const errors = result.error.errors.map(err => err.message).join(", ");
      toast.error(`Invalid variable format: ${errors}`);
      continue;
    }

    if (variables.some((v) => v.key === key)) {
      toast.error(`Key already exists, line skipped: "${key}"`);
      continue;
    }

    parsed.push({ key, value, visible: false });
  }

  return parsed;
}
