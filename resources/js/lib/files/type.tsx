// lib/files/type.tsx

// Necessary imports
import { z } from "zod";

// Icons
import {
	ArrowRight,
	FileArchive,
	Info,
	FolderGit2,
	Loader2,
	ArrowDownToLine,
	FileUp,
	ChevronDown,
	Github,
	Gitlab,
	X,
	Check,
	GitBranch,
	Tag,
} from "lucide-react";

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// Schema
export const FileSchema = z.discriminatedUnion("type", [
	// GIT
	z.object({
		type: z.literal("git"),
		// Bitbucket for a next release
		git_provider: z.enum(["github", "gitlab"], {
			message:
				"The git provider is required and must be either 'github', or 'gitlab'.",
		}),
		git_repository: z
			.string({ message: "The git repository name must be a string" })
			.nonempty("The git repository is required")
			.regex(/^[A-Za-z0-9._-]+$/, {
				message:
					"The git repository name must only include alphanumeric characters, dots, underscores, or hyphens.",
			}),
		git_type: z.enum(["branch", "tag"], {
			message: "The git type is required must be either 'branch' or 'tag'. ",
		}),
		git_target: z
			.string({ message: "The git target name must be a string" })
			.nonempty("The git target is required")
			.regex(/^[A-Za-z0-9._\/-]+$/, {
				message:
					"The git target name must only include alphanumeric characters, dots, underscores, hyphens, and slashes.",
			}),
	}),

	// IMPORT ZIP FILE
	z.object({
		type: z.literal("import"),
		import_file: z
			.instanceof(File, { message: "The uploaded file must be a valid file" })
			.refine(
				(file) => file.type === "application/zip" || file.name.endsWith(".zip"),
				{
					message: "The file must be a ZIP archive",
				},
			)
			.refine((file) => file.size <= MAX_FILE_SIZE, {
				message: `The file must not exceed ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
			}),
	}),

	// NONE
	z.object({
		type: z.literal("none"),
	}),
]);

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

// Select options
export const git_types = [
	{ label: "Branch", value: "branch", icon: <GitBranch /> },
	{ label: "Tag", value: "tag", icon: <Tag /> },
];

export const git_providers = [
	{ label: "GitHub", value: "github", icon: <Github /> },
	{ label: "GitLab", value: "gitlab", icon: <Gitlab /> },
];