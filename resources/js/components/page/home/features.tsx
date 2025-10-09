// components/page/home/features.tsx

// Necessary imports
import { useAppearance } from "@/hooks/use-appearance";

// Shadcn UI Components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Check, CircleDashed, CalendarCheck } from "lucide-react";

type Feature = {
	title: string;
	description: string;
	status: "done" | "wip" | "planned";
};

const features: Feature[] = [
	{
		title: "System Authentication",
		description: "Login using the server's Unix user for secure, local auth.",
		status: "done",
	},
	{
		title: "Projects",
		description: "Create and manage projects with .env, Makefile, and Compose.",
		status: "done",
	},
	{
		title: "Docker Compose",
		description:
			"Manage full Compose stacks including containers, volumes, and networks.",
		status: "done",
	},
	{
		title: "Landing Experience",
		description: "A clean, focused landing to explain value and entry points.",
		status: "done",
	},
	{
		title: "Command Audit Log",
		description: "Track every executed command with timestamp, user, and output.",
		status: "done",
	},
	{
		title: "Project Files",
		description:
			"Use local or repo files to run containers without external images.",
		status: "wip",
	},
	{
		title: "One-file Backup",
		description:
			"Export and restore full project configuration from a single file.",
		status: "planned",
	},
	{
		title: "Quick Tasks",
		description: "One-click recipes for Traefik, Minecraft server, and more.",
		status: "planned",
	},
	{
		title: "Advanced Containers",
		description: "Detailed views with logs, exec, and richer container insights.",
		status: "planned",
	},
	{
		title: "Code Refactor",
		description: "Revamp codebase for clarity, tests, and long-term stability.",
		status: "planned",
	},
	{
		title: "UI/UX Polish",
		description: "Refine animations and unify interface for consistent visuals.",
		status: "planned",
	},
	{
		title: "Update Helper",
		description: "One-click intuitive update from GitHub repository.",
		status: "planned",
	},
	{
		title: "Guided Setup",
		description:
			"Step-by-step onboarding to configure projects with best practices.",
		status: "planned",
	},
	{
		title: "SSH Keys",
		description: "Manage authorized SSH keys allowed to access your VPS.",
		status: "planned",
	},
	{
		title: "Web Terminal",
		description: "Run commands on the VPS directly from the application.",
		status: "planned",
	},
	{
		title: "VPS Settings",
		description:
			"Configure SSH port, security hardening, and core system options.",
		status: "planned",
	},
	{
		title: "Responsive Design",
		description:
			"Ensure a seamless experience across desktop, tablet, and mobile.",
		status: "planned",
	},
];

export function Features() {
	const { appearance } = useAppearance();

	return (
		<section className="py-8 lg:py-12" id="features">
			<h5 className="text-primary font-medium mb-3 text-sm bg-muted rounded-xl px-3 py-1 inline-block">
				Features
			</h5>
			<h2 className="text-foreground text-balance text-3xl md:text-3xl">
				<span className="text-muted-foreground">Streamline your workflow with</span>{" "}
				powerful VPS features
			</h2>

			<div className="@container mt-12 space-y-12">
				<Card className="relative overflow-hidden p-0 sm:col-span-2">
					<div className="absolute inset-0 size-full object-cover bg-gradient-to-l from-primary/50 to-muted" />
					<div className="m-auto w-full p-4 sm:p-12 relative z-1">
						{appearance === "dark" && (
							<img
								src="assets/images/create-dark.png"
								alt="Page - creation of a project"
								className="object-top-left size-full object-cover rounded-md"
							/>
						)}

						{appearance === "light" && (
							<img
								src="assets/images/create-light.png"
								alt="Page - creation of a project"
								className="object-top-left size-full object-cover rounded-md"
							/>
						)}

						{appearance === "system" && (
							<img
								src={
									window.matchMedia("(prefers-color-scheme: dark)").matches
										? "assets/images/create-dark.png"
										: "assets/images/create-light.png"
								}
								alt="Page - creation of a project"
								className="object-top-left size-full object-cover rounded-md"
							/>
						)}
					</div>
				</Card>
				<div className="grid-cols-1 lg:grid-cols-3 grid">
					{features.map((f) => (
						<Feature key={f.title} feature={f} />
					))}
				</div>
			</div>
		</section>
	);
}

function Feature({ feature }: { feature: Feature }) {
	return (
		<div
			className="
			space-y-2 lg:p-6 p-4

			border-b
			last:border-b-0
        	lg:[&:nth-last-child(-n+3)]:border-b-0

			border-l-0
			lg:[&:nth-child(3n+2)]:border-l
			lg:[&:nth-child(3n+3)]:border-l	
			"
		>
			<Badge
				variant={
					feature.status === "done"
						? "default"
						: feature.status === "wip"
							? "outline"
							: "secondary"
				}
			>
				{feature.status === "done" ? (
					<Check />
				) : feature.status === "wip" ? (
					<CircleDashed />
				) : (
					<CalendarCheck />
				)}
				{feature.status === "done"
					? "Completed"
					: feature.status === "wip"
						? "In Progress"
						: "To Come"}
			</Badge>
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-medium">{feature.title}</h3>
			</div>
			<p className="text-muted-foreground">{feature.description}</p>
		</div>
	);
}
