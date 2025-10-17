// lib/files/utils.tsx

// Necessary imports
import JSZip from "jszip";

// Types
import type { FS_Element, FS_FileStructure } from "@/lib/files/type";

// Mocks
import {
	mock_repositories_github,
	mock_repositories_gitlab,
	mock_targets_branch,
	mock_targets_tag,
	mock_username,
	mock_name,
	mock_avatar,
} from "@/lib/files/type";

/**
 * Fetch repositories for a given provider
 */
export async function fetchRepositories({ provider }: { provider: string }) {
	await new Promise((r) => setTimeout(r, 2000));

	if (provider === "github") {
		return mock_repositories_github;
	} else if (provider === "gitlab") {
		return mock_repositories_gitlab;
	} else {
		return [];
	}
}

/**
 * Fetch targets for a given type
 */
export async function fetchTargets({ type }: { type: string }) {
	await new Promise((r) => setTimeout(r, 2000));

	if (type === "branch") {
		return mock_targets_branch;
	} else if (type === "tag") {
		return mock_targets_tag;
	} else {
		return [];
	}
}

/**
 * Connect to a git provider
 */
export async function connectProvider({ provider }: { provider: string }) {
	await new Promise((r) => setTimeout(r, 2000));

	const success = provider === "github" ? true : false;

	return {
		providerStatus: success,
		username: mock_username.trim(),
		name: mock_name.trim() || undefined,
		avatar: mock_avatar.trim() || undefined,
	};
}

/**
 * Extract a zip file and return its file structure
 */
export async function extractZipFile(file: File): Promise<FS_FileStructure> {
	const zip = await JSZip.loadAsync(file, { createFolders: true });
	const entries = Object.values(zip.files);

	const root: FS_FileStructure = { elements: [] };
	const dirMap = new Map<string, FS_Element>();
	dirMap.set("", {
		name: "",
		type: "directory",
		status: "idle",
		path: "",
		date: new Date(0),
		children: root.elements,
	});

	const norm = (p: string) => p.replace(/\/+$/, "");
	const parentPathOf = (full: string) => {
		const parts = full.replace(/\/+$/, "").split("/").filter(Boolean);
		return parts.slice(0, -1).join("/");
	};
	const baseNameOf = (full: string) => {
		const s = full.replace(/\/+$/, "");
		const idx = s.lastIndexOf("/");
		return idx >= 0 ? s.slice(idx + 1) : s;
	};

	const getExtension = (name: string): string | undefined => {
		const knownDoubleExt = [
			"blade.php",
			"compose.yaml",
			"compose.yml",
			// "spec.ts",
			// "spec.js",
			// "test.ts",
			// "test.js",
			// "d.ts",
			// "module.css",
			// "module.scss",
		];

		const lower = name.toLowerCase();

		for (const ext of knownDoubleExt) {
			if (lower.endsWith(`.${ext}`)) return ext;
		}

		const idx = lower.lastIndexOf(".");
		return idx > 0 ? lower.slice(idx + 1) : undefined;
	};

	const getOrCreateDir = (dirPath: string): FS_Element => {
		const key = norm(dirPath);
		if (dirMap.has(key)) return dirMap.get(key)!;
		const parent = getOrCreateDir(parentPathOf(dirPath));
		const node: FS_Element = {
			name: baseNameOf(dirPath),
			type: "directory",
			status: "idle",
			path: key ? key + "/" : "",
			date: new Date(0),
			children: [],
		};
		parent.children!.push(node);
		dirMap.set(key, node);
		return node;
	};

	for (const entry of entries) {
		const full = entry.name;
		if (entry.dir) {
			const dirNode = getOrCreateDir(full);
			dirNode.date = entry.date ?? dirNode.date;
		} else {
			const parent = getOrCreateDir(parentPathOf(full));
			const name = baseNameOf(full);
			const node: FS_Element = {
				name,
				type: "file",
				path: full,
				date: entry.date,
				saved: true,
				extension: getExtension(name),
			};
			parent.children!.push(node);
		}
	}

	return root;
}

/**
 * Load the content of a file
 */
export async function loadFileContent(
	fs: FS_FileStructure,
	element: FS_Element,
): Promise<string> {
	return "";
}
