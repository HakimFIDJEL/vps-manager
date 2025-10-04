// lib/files/utils.tsx

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
	await new Promise((r) => setTimeout(r, 4000));

	if (provider === "github") {
		return mock_repositories_github;
	} else if (provider === "gitlab") {
		return mock_repositories_gitlab;
	} else {
		return [];
	}
}

export async function fetchTargets({ type }: { type: string }) {
	await new Promise((r) => setTimeout(r, 4000));

	if (type === "branch") {
		return mock_targets_branch;
	} else if (type === "tag") {
		return mock_targets_tag;
	} else {
		return [];
	}
}

export async function connectProvider({ provider } : { provider: string }) {
	await new Promise((r) => setTimeout(r, 4000));

	const success = provider === "github" ? true : false;

	return {
		providerStatus: success,
		username: mock_username.trim(),
		name: mock_name.trim() || undefined,
		avatar: mock_avatar.trim() || undefined,
	}
}
