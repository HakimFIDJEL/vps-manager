// components/page/home/features.tsx

// Necessary imports
import { useAppearance } from "@/hooks/use-appearance";

// Shadcn UI Components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Check, CircleDashed, CalendarCheck } from "lucide-react";

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
					<Feature
						title="System Authentication"
						description="Login using the server's Unix user for secure, local auth."
						status="done"
						className="lg:pl-0 lg:border-r border-b"
					/>
					<Feature
						title="Projects"
						description="Create and manage projects with .env, Makefile, and Compose."
						status="done"
						className="border-b"
					/>
					<Feature
						title="Docker Compose"
						description="Manage full Compose stacks including containers, volumes, and networks."
						status="done"
						className="lg:pr-0 lg:border-l border-b"
					/>

					<Feature
						title="Landing Experience"
						description="A clean, focused landing to explain value and entry points."
						status="done"
						className="lg:pl-0 lg:border-r border-b"
					/>
					<Feature
						title="Command Audit Log"
						description="Track every executed command with timestamp, user, and output."
						status="done"
						className="border-b"
					/>
					<Feature
						title="Project Files"
						description="Use local or repo files to run containers without external images."
						status="wip"
						className="lg:pr-0 lg:border-l border-b"
					/>
					<Feature
						title="Guided Setup"
						description="Step-by-step onboarding to configure projects with best practices."
						status="planned"
						className="lg:pl-0 lg:border-r border-b"
					/>
					<Feature
						title="Quick Tasks"
						description="One-click recipes for Traefik, Minecraft server, and more."
						status="planned"
						className="border-b"
					/>
					<Feature
						title="One-file Backup"
						description="Export and restore full project configuration from a single file."
						status="planned"
						className="lg:pr-0 lg:border-l border-b"
					/>
					<Feature
						title="Advanced Containers"
						description="Detailed views with logs, exec, and richer container insights."
						status="planned"
						className="lg:pl-0 lg:border-r border-b"
					/>
					<Feature
						title="SSH Keys"
						description="Manage authorized SSH keys allowed to access your VPS."
						status="planned"
						className="border-b"
					/>
					<Feature
						title="Web Terminal"
						description="Run commands on the VPS directly from the application."
						status="planned"
						className="lg:pr-0 lg:border-l border-b"
					/>
					<Feature
						title="VPS Settings"
						description="Configure SSH port, security hardening, and core system options."
						status="planned"
						className="lg:pl-0 lg:border-r border-b lg:border-b-0"
					/>
					<Feature
						title="Responsive Design"
						description="Ensure a seamless experience across desktop, tablet, and mobile."
						status="planned"
						className="border-b lg:border-b-0"
					/>
					<Feature
						title="Update Helper"
						description="One-click intuitive update from GitHub repository."
						status="planned"
						className="lg:pr-0 lg:border-l lg:border-b-0"
					/>
				</div>
			</div>
		</section>
	);
}

function Feature({
	title,
	description,
	status,
	className,
}: {
	title: string;
	description: string;
	status: "done" | "wip" | "planned";
	className?: string;
}) {
	return (
		<div className={`space-y-2 lg:p-6 p-4 ${className}`}>
			<Badge
				variant={
					status === "done" ? "default" : status === "wip" ? "outline" : "secondary"
				}
			>
				{status === "done" ? (
					<Check />
				) : status === "wip" ? (
					<CircleDashed />
				) : (
					<CalendarCheck />
				)}
				{status === "done"
					? "Completed"
					: status === "wip"
						? "In Progress"
						: "To Come"}
			</Badge>
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-medium">{title}</h3>
			</div>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}
