// components/page/home/solution.tsx

// Shadcn UI Components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icons
import { Terminal, Wrench, ClipboardList } from "lucide-react";

export function Solution() {
	return (
		<section className="py-16">
			<h5 className="text-primary font-medium mb-3 text-sm bg-muted rounded-xl px-3 py-1 inline-block">
				Solution
			</h5>
			<h2 className="text-foreground text-balance text-3xl md:text-3xl">
				<span className="text-muted-foreground">From CLI friction to</span>{" "}
				confident operations
			</h2>

			<Card className="mt-10 overflow-hidden bg-card/50">
				<div className="relative grid lg:grid-cols-[1fr_1.1fr_1fr]">
					{/* Connecteurs (desktop) */}

					{/* Problem */}
					<div className="p-6 lg:p-8 relative">
						<span className="mb-4 flex items-center gap-3">
							<Badge
								variant="secondary"
								className="rounded-full h-7 w-7 p-1 border border-border"
							>
								<Terminal className="!h-4 !w-4" />
							</Badge>
							<Badge
								className="border border-border h-7 rounded-full px-2.5"
								variant="secondary"
							>
								Problem
							</Badge>
						</span>
						<h3 className="text-xl font-medium mb-3">CLI is unforgiving</h3>
						<ul className="text-muted-foreground space-y-2 text-sm list-disc pl-4">
							<li>Command-heavy workflow with little visual feedback</li>
							<li>Easy to break services with small mistakes</li>
							<li>Project context is easy to mix up</li>
							<li>Limited traceability of executed actions</li>
							<li>No centralized view across projects</li>
							<li>Hard to onboard new team members</li>
						</ul>
					</div>

					{/* Solution (primaire) */}
					<div className="p-6 lg:p-8 relative ring-1 ring-primary/15 bg-gradient-to-b from-primary/8 via-background to-primary/8 rounded-none">
						<div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
						<span className="mb-4 flex items-center gap-3">
							<Badge
								variant="default"
								className="rounded-full h-7 w-7 p-1 border border-primary/50 bg-primary/20 text-foreground"
							>
								<Wrench className="!h-4 !w-4" />
							</Badge>
							<Badge
								className="border h-7 rounded-full border-primary/50 bg-primary/15 px-2.5 text-foreground"
								variant="default"
							>
								Solution
							</Badge>
						</span>
						<h3 className="text-xl font-medium mb-3">UI-guided control</h3>
						<ul className="text-muted-foreground space-y-2 text-sm list-disc pl-4">
							<li>Visual workflows for Compose: containers, volumes, networks</li>
							<li>Project-scoped safe actions with prechecks</li>
							<li>Unified audit log with timestamp, user, and output</li>
							<li>One-file backup and restore for full project config</li>
						</ul>
						<Separator className="my-6" />
						<div className="flex flex-wrap gap-2 text-xs">
							<span className="rounded-full bg-primary/10 text-primary px-3 py-1">
								Visual orchestration
							</span>
							<span className="rounded-full bg-primary/10 text-primary px-3 py-1">
								Audit trail
							</span>
							<span className="rounded-full bg-primary/10 text-primary px-3 py-1">
								One-click setup
							</span>
							<span className="rounded-full bg-primary/10 text-primary px-3 py-1">
								And much more!
							</span>
						</div>
					</div>

					{/* Outcome (accent) */}
					<div className="p-6 lg:p-8 relative ring-1 ring-accent/20 bg-gradient-to-b from-accent/20 via-background to-accent/20">
						<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
						<span className="mb-4 flex items-center gap-3">
							<Badge
								variant="outline"
								className="rounded-full h-7 w-7 p-0 border dark:border-accent/50 border-border dark:bg-accent/20 bg-accent"
							>
								<ClipboardList className="!h-4 !w-4" />
							</Badge>
							<Badge
								className="border h-7 rounded-full dark:border-accent/50 border-border dark:bg-accent/20 bg-accent px-2.5"
								variant="outline"
							>
								Outcome
							</Badge>
						</span>
						<h3 className="text-xl font-medium mb-3">Fewer errors, more speed</h3>
						<ul className="text-muted-foreground space-y-2 text-sm list-disc pl-4">
							<li>Faster, consistent deployments across projects</li>
							<li>Confident rollbacks with clear, searchable history</li>
							<li>Fewer mistakes and lower cognitive load</li>
							<li>Centralized visibility of VPS resources</li>
							<li>Smoother onboarding for new users</li>
							<li>Better collaboration between developers and ops</li>
						</ul>
					</div>
				</div>
			</Card>
		</section>
	);
}
