import { z } from "zod";
import { VariableSchema, type Variable } from "@/lib/variables/type";
import { type DockerCompose, DockerComposeStateSchema } from "@/lib/docker/type";
import { CommandSchema, type Command } from "@/lib/commands/type";

// Types
export type Project = {
	name: string;
	folderPath: string;
	variables: Variable[];
	commands: Command[];
	docker: DockerCompose;
};

export type ProjectContextType = {
	project: Project;
	setProject: React.Dispatch<React.SetStateAction<Project>>;
	updateProject: <K extends keyof Project>(key: K, value: Project[K]) => void;
};

export const DEFAULT_PROJECT: Project = {
	name: "",
	folderPath: "",
	variables: [],
	commands: [],
	docker: {
		content: "",
		isSaved: true,
		isStrict: false,
		parsed: {
			services: [],
			volumes: [],
			networks: [],
		},
	},
};

// Schemas
export const ProjectSchema = z.object({
	name: z.string().nonempty(),
	folderPath: z.string().nonempty(),
	variables: z.array(VariableSchema),
	commands: z.array(CommandSchema),
	docker: DockerComposeStateSchema,
});
