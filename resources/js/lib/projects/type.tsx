import { z } from "zod";
import { VariableSchema, type Variable } from "@/lib/variables/type";
import {
	type DockerCompose,
	DockerComposeStateSchema,
} from "@/lib/docker/type";
import { CommandSchema, type Command } from "@/lib/commands/type";
import { FileSchema, mock_file_structure, type Files } from "@/lib/files/type";

// Types
export type Project = {
	// Optional properties
	inode?: number;
	size?: number;
	updated_at: { date: string | undefined };
	created_at: { date: string | undefined };

	// Required properties
	path: string;
	files: Files;
	variables: Variable[];
	docker: DockerCompose;
	commands: Command[];
	isCreated: boolean;
};

export type ProjectContextType = {
	project: Project;
	setProject: React.Dispatch<React.SetStateAction<Project>>;
	updateProject: <K extends keyof Project>(key: K, value: Project[K]) => void;
};

export const DEFAULT_PROJECT: Project = {
	path: "",
	// files: { type: "none" },
	files: { type: "import", import: { file_structure: mock_file_structure } },
	variables: [],
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
	commands: [],
	isCreated: false,
	created_at: { date: undefined },
	updated_at: { date: undefined },
};

// min 6 caracters
export const FolderSchema = z.object({
	path: z
		.string()
		.min(6, "Folder path must be at least 6 characters long")
		.nonempty("Folder path is required")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Folder path can only contain alphanumeric characters, underscores, and hyphens",
		),
});

// Schemas
export const ProjectSchema = z.object({
	path: FolderSchema.shape.path,
	files: FileSchema,
	variables: z.array(VariableSchema),
	docker: DockerComposeStateSchema,
	commands: z.array(CommandSchema),
});

// Mocks
export const ProjectExample: Project = {
	inode: 1234197,
	size: 2048,
	updated_at: { date: "2023-10-01T12:00:00Z" },
	created_at: { date: "2023-09-01T12:00:00Z" },

	path: "example-project",
	files: { type: "none" },
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
};

export const ProjectListExample: Project[] = [
	{
		inode: 1234567,
		size: 1224,
		updated_at: { date: "2023-10-01T12:00:00Z" },
		created_at: { date: "2023-09-01T12:00:00Z" },

		path: "/projects/portfolio",
		files: { type: "none" },
		variables: [
			{ key: "API_URL", value: "https://api.portfolio.com" },
			{ key: "DEBUG", value: "true" },
		],
		commands: [
			{
				target: "start",
				command: "npm start",
				description: "Start the development server",
			},
			{
				target: "build",
				command: "npm run build",
				description: "Build the project",
			},
		],
		docker: {
			content:
				"version: '3.8'\nservices:\n  app:\n    image: portfolio-app:latest",
			isSaved: true,
			isStrict: false,
			parsed: {
				services: [{ name: "app", image: "portfolio-app:latest" }],
				volumes: [],
				networks: [],
			},
		},
		isCreated: true,
	},
	{
		inode: 1234568,
		size: 4096,
		updated_at: { date: "2023-10-02T12:00:00Z" },
		created_at: { date: "2023-09-02T12:00:00Z" },

		path: "/projects/ecommerce",
		files: { type: "none" },
		variables: [
			{ key: "DB_HOST", value: "localhost" },
			{ key: "DB_PORT", value: "3306" },
		],
		commands: [
			{ target: "test", command: "npm test", description: "Run tests" },
			{
				target: "deploy",
				command: "npm run deploy",
				description: "Deploy the project",
			},
		],
		docker: {
			content: "version: '3.8'\nservices:\n  db:\n    image: mysql:8.0",
			isSaved: false,
			isStrict: true,
			parsed: {
				services: [{ name: "db", image: "mysql:8.0" }],
				volumes: [],
				networks: [],
			},
		},
		isCreated: false,
	},
	{
		inode: 1234569,
		size: 2048,
		updated_at: { date: "2023-10-03T12:00:00Z" },
		created_at: { date: "2023-09-03T12:00:00Z" },

		path: "/projects/blog",
		files: { type: "none" },
		variables: [
			{ key: "BLOG_TITLE", value: "My Personal Blog" },
			{ key: "BLOG_THEME", value: "dark" },
		],
		commands: [
			{
				target: "serve",
				command: "npm run serve",
				description: "Serve the blog locally",
			},
			{
				target: "publish",
				command: "npm run publish",
				description: "Publish the blog",
			},
		],
		docker: {
			content: "version: '3.8'\nservices:\n  web:\n    image: nginx:latest",
			isSaved: true,
			isStrict: false,
			parsed: {
				services: [{ name: "web", image: "nginx:latest" }],
				volumes: [],
				networks: [],
			},
		},
		isCreated: true,
	},
];
