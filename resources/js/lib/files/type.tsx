import { z } from "zod";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export const FileSchema = z.discriminatedUnion("type", [
	// GIT
	z.object({
		type: z.literal("git"),
		// Bitbucket for a next release
		git_provider: z.enum(["github", "gitlab"], { message: "The git provider is required and must be either 'github', or 'gitlab'." }),
		git_repository: z
			.string({ message: "The git repository name must be a string" })
            .nonempty("The git repository is required")
			.regex(/^[A-Za-z0-9._-]+$/, {
				message:
					"The git repository name must only include alphanumeric characters, dots, underscores, or hyphens.",
			}),
		git_type: z.enum(["branch", "tag"], { message: "The git type is required and must be either 'branch' or 'tag'. " }),
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
