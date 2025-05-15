// Necessary imports
import { toast } from "sonner"
import { z } from "zod";

// Types
import { type Variable, VariableSchema } from "@/types/models/project";


// Parse .env content into key-value pairs
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
      toast.error(`Invalid format, line skipped : "${line}"`);
      continue;
    }
    const key = match[1].trim();
    const value = match[2];

    try {
      VariableSchema.parse({ key, value });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(
          `Erreur sur "${line}" : ${err.errors[0].message}`
        );
      }
      continue;
    }

    if (variables.some((v) => v.key === key)) {
      toast.error(`Key already existing, line skipped : "${key}"`);
      continue;
    }

    parsed.push({ key, value, visible: false });
  }
  return parsed;
}
