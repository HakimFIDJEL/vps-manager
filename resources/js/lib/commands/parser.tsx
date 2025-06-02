import { toast } from "sonner";
import { z } from "zod";
import { type Command, CommandSchema } from "@/lib/commands/type";

export function parseCommandsFromMakefile({
  content,
  commands,
}: {
  content: string;
  commands: Command[];
}) {
  const lines = content.split(/\r?\n/);
  const parsed: Command[] = [];
  let currentTarget: string | null = null;
  let currentDescription: string[] = [];
  let currentCommand: string[] = [];
  let isCollectingCommand = false;

  console.log("Parsing Makefile content...");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Détecter une nouvelle target
    const targetMatch = trimmedLine.match(/^([a-z_][a-z0-9_]*):/);
    if (targetMatch) {
      // Si on avait une target précédente, on la sauvegarde
      if (currentTarget && currentCommand.length > 0) {
        const command = {
          target: currentTarget,
          description: currentDescription.length > 0 ? currentDescription.join(" ").trim() : "Unknown description",
          command: currentCommand.join("\n").trim(),
        };

        // Validation avec le schéma
        const result = CommandSchema.safeParse(command);
        if (!result.success) {
          const errors = result.error.errors.map(err => err.message).join(", ");
          toast.error(`1 - Invalid command format for target ${currentTarget}: ${errors}`);
        } else if (commands.some((c) => c.target === currentTarget)) {
          toast.error(`Target already exists: "${currentTarget}"`);
        } else {
          parsed.push(command);
        }
      }

      // Réinitialiser pour la nouvelle target
      currentTarget = targetMatch[1];
      currentDescription = [];
      currentCommand = [];
      isCollectingCommand = false;

      // Chercher les commentaires précédents pour la description
      let j = i - 1;
      while (j >= 0) {
        const prevLine = lines[j].trim();
        if (prevLine === "") break;
        if (prevLine.startsWith("#")) {
          const comment = prevLine.substring(1).trim();
          if (comment) {
            currentDescription.unshift(comment);
          }
        } else {
          break;
        }
        j--;
      }

      continue;
    }

    // Si on a une target active
    if (currentTarget) {
      // Si la ligne commence par un tab ou des espaces, c'est une commande
      if (line.startsWith("\t") || line.startsWith(" ")) {
        isCollectingCommand = true;
        currentCommand.push(line.trim());
      }
      // Si c'est un commentaire et qu'on n'a pas encore de commande, c'est une description
      else if (trimmedLine.startsWith("#")) {
        const comment = trimmedLine.substring(1).trim();
        if (comment && !isCollectingCommand) {
          currentDescription.push(comment);
        }
      }
    }
  }

  // Ne pas oublier la dernière target
  if (currentTarget && currentCommand.length > 0) {
    const command = {
      target: currentTarget,
      description: currentDescription.length > 0 ? currentDescription.join(" ").trim() : "Unknown description",
      command: currentCommand.join("\n").trim(),
    };

    const result = CommandSchema.safeParse(command);
    if (!result.success) {
      const errors = result.error.errors.map(err => err.message).join(", ");
      toast.error(`2 - Invalid command format for target ${currentTarget}: ${errors}`);
    } else if (commands.some((c) => c.target === currentTarget)) {
      toast.error(`Target already exists: "${currentTarget}"`);
    } else {
      parsed.push(command);
    }
  }

  console.log("Parsed commands:", parsed);

  if (parsed.length === 0) {
    toast.error("No valid commands found in the file. Make sure your targets are properly formatted and have commands.");
  }

  return parsed;
}
