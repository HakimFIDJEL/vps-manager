// lib/files/type.tsx

// Necessary imports
import { z } from "zod";

// Icons
import { Github, Gitlab, GitBranch, Tag } from "lucide-react";

// Enums
export type GitProvider = "github" | "gitlab";
export type GitType = "branch" | "tag";

// Types
export type Files = {
	type: "git" | "import" | "none";
	git?: {
		provider: GitProvider;
		repository: string;
		type: GitType;
		target: string;
		username: string;
		name?: string;
		avatar?: string;
	};
	import?: {
		file_structure?: FS_FileStructure;
		file?: File;
	};
};

export type FS_FileStructure = {
	elements: FS_Element[];
}

export type FS_Element = {
	name: string;
	type: "file" | "directory";
	status? : "loading" | "success" | "error" | "idle";
	size?: number;
	path: string;
	extension?: string;
	permissions?: string;
	children?: FS_Element[];
	date: Date;
}

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// Schemas
const GitSchema = z
	.object({
		provider: z.enum(["github", "gitlab"], {
			message:
				"The git provider is required must be either 'github', or 'gitlab'.",
		}),
		repository: z
			.string({ message: "The git repository name must be a string" })
			.nonempty("The git repository is required")
			.regex(/^[A-Za-z0-9._-]+$/, {
				message:
					"The git repository name must only include alphanumeric characters, dots, underscores, or hyphens.",
			}),
		type: z.enum(["branch", "tag"], {
			message: "The git type is required must be either 'branch' or 'tag'. ",
		}),
		target: z
			.string({ message: "The git target name must be a string" })
			.nonempty("The git target is required")
			.regex(/^[A-Za-z0-9._\/-]+$/, {
				message:
					"The git target name must only include alphanumeric characters, dots, underscores, hyphens, and slashes.",
			}),
		username: z
			.string({ message: "The git username must be a string" })
			.nonempty("The git username is required"),
		name: z.string().optional(),
		avatar: z.string().url("The git avatar must be a valid URL").optional(),
	})
	.strict();

const ImportSchema = z
	.object({
		file: z
			.custom<File>((f): f is File => f instanceof File, {
				message: "Uploaded file must be a File",
			})
			.refine(
				(file) =>
					file.type === "application/zip" ||
					file.name.toLowerCase().endsWith(".zip"),
				{ message: "File must be a ZIP archive" },
			)
			.refine((file) => file.size <= MAX_FILE_SIZE, {
				message: `File must not exceed ${MAX_FILE_SIZE / 1024 / 1024} MB`,
			}),
	})
	.strict();

export const FileSchema = z.discriminatedUnion("type", [
	z.object({ type: z.literal("git"), git: GitSchema }).strict(),
	z.object({ type: z.literal("import"), import: ImportSchema }).strict(),
	z.object({ type: z.literal("none") }).strict(),
]);

// Select options
export const git_types = [
	{ label: "Branch", value: "branch", icon: <GitBranch /> },
	{ label: "Tag", value: "tag", icon: <Tag /> },
];

export const git_providers = [
	{ label: "GitHub", value: "github", icon: <Github /> },
	{ label: "GitLab", value: "gitlab", icon: <Gitlab /> },
];

// Mocks
export const mock_repositories_github = [
	{ label: "my-repo", value: "my-repo" },
	{ label: "another-repo", value: "another-repo" },
	{ label: "test-repo", value: "test-repo" },
];

export const mock_repositories_gitlab = [
	{ label: "project-alpha", value: "project-alpha" },
	{ label: "project-beta", value: "project-beta" },
	{ label: "project-gamma", value: "project-gamma" },
];

export const mock_targets_branch = [
	{ label: "main", value: "main" },
	{ label: "development", value: "development" },
	{ label: "feature-xyz", value: "feature-xyz" },
];

export const mock_targets_tag = [
	{ label: "v1.0.0", value: "v1.0.0" },
	{ label: "v1.1.0", value: "v1.1.0" },
	{ label: "v2.0.0", value: "v2.0.0" },
];

export const mock_username = "hakimfidjel";
export const mock_name = "Hakim Fidjel";
export const mock_avatar = "https://github.com/hakimfidjel.png";

// Actions & Services
export type FileAction =
	| { type: "file-reset-type" }
	| { type: "file-git-link"; files: Files }
	| { type: "file-import-upload"; file: File; }
	| { type: "file-import-get-fs"; file: File; }
	| { type: "file-import-load-file-content"; fs?: FS_FileStructure, element: FS_Element };

export type ActionOf<T extends FileAction["type"]> = Extract<
	FileAction,
	{ type: T }
>;
export type TypedHandler<T extends FileAction["type"]> = (
	a: ActionOf<T>,
) => Promise<boolean>;
export type Registry = { [K in FileAction["type"]]?: TypedHandler<K> };

export interface FileService {
	handleFile(action: FileAction): Promise<boolean>;
}
