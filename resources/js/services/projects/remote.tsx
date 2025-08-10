import { toast } from "sonner";

export async function verifyPathAvailability(path: string): Promise<boolean> {
	try {
		const response = await fetch(
			route("projects.verify-path-availability", { path }),
			{
				method: "GET",
				headers: { Accept: "application/json" },
			},
		);

		if (!response.ok) {
			throw new Error("Failed to check path availability");
		}

		const data = await response.json();

		return data.availability === true;
	} catch (error: any) {
		toast.error("An error occured", {
			description: error.message ?? "Please try again later.",
		});
		return false;
	}
}
