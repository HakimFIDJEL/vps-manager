import { z } from "zod";
import { VariableSchema, type Variable } from "@/lib/variables/type";
import { type DockerCompose, DockerComposeStateSchema } from "@/lib/docker/type";
import { CommandSchema, type Command } from "@/lib/commands/type";

// Types
export type Project = {
	path: string;
	variables: Variable[];
	commands: Command[];
	docker: DockerCompose;
	isCreated: boolean;
};

export type ProjectContextType = {
	project: Project;
	setProject: React.Dispatch<React.SetStateAction<Project>>;
	updateProject: <K extends keyof Project>(key: K, value: Project[K]) => void;
};

export const DEFAULT_PROJECT: Project = {
	path: "",
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
	isCreated: false,
};

// min 6 caracters
export const FolderSchema = z.object({
	path: z.string()
	.min(6, "Folder path must be at least 6 characters long")
	.nonempty("Folder path is required")
	.regex(/^[a-zA-Z0-9_\-\/]+$/, "Folder path can only contain alphanumeric characters, underscores, hyphens, and slashes"),
});


// Schemas
export const ProjectSchema = z.object({
	path: FolderSchema.shape.path,
	variables: z.array(VariableSchema),
	commands: z.array(CommandSchema),
	docker: DockerComposeStateSchema,
});


export const ProjectExample: Project = {
	path: "example-project",
	variables: [
		{
			key: "EXAMPLE_VAR",
			value: "example_value",
		},
	],
	commands: [
		{
			target: "build",
			command: "npm run build",
			description: "Build the project",
		},
	],
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
	isCreated: true,
}