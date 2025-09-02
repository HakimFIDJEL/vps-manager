// components/page/home/Customers.tsx

// Shadcn UI Components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Icons
import {
	User,
	Users,
	Building2,
	Github,
	List,
	Check,
} from "lucide-react";

export function Customers() {
	return (
		<section className="py-16">
			<h5 className="text-primary font-medium mb-3 text-sm bg-muted rounded-xl px-3 py-1 inline-block">
				Customers
			</h5>
			<h2 className="text-foreground text-balance text-3xl md:text-3xl">
				<span className="text-muted-foreground">Built for anyone with a</span> VPS
			</h2>

			<div className="mt-10 grid gap-2 lg:grid-cols-3">
				<Card className="p-6 hover:border-primary/50 transition-colors">
					<div className="flex items-center gap-3 mb-3">
						<div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
							<User className="size-4" />
						</div>
						<h3 className="text-lg font-medium">Solo developers</h3>
					</div>
					<ul className="text-muted-foreground text-sm space-y-2 list-disc pl-4">
						<li>Self-host personal projects on a single VPS</li>
						<li>Orchestrate Compose stacks without CLI overhead</li>
						<li>Keep changes traceable across iterations</li>
					</ul>
				</Card>

				<Card className="p-6 hover:border-primary/50 transition-colors">
					<div className="flex items-center gap-3 mb-3">
						<div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
							<Users className="size-4" />
						</div>
						<h3 className="text-lg font-medium">Small teams</h3>
					</div>
					<ul className="text-muted-foreground text-sm space-y-2 list-disc pl-4">
						<li>Shared dashboard with per-project context</li>
						<li>Audit trail for accountability and rollbacks</li>
						<li>One-file backup and restore of environments</li>
					</ul>
				</Card>

				<Card className="p-6 hover:border-primary/50 transition-colors">
					<div className="flex items-center gap-3 mb-3">
						<div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
							<Building2 className="size-4" />
						</div>
						<h3 className="text-lg font-medium">Companies</h3>
					</div>
					<ul className="text-muted-foreground text-sm space-y-2 list-disc pl-4">
						<li>On-prem or private server friendly</li>
						<li>Unix user auth and controlled actions</li>
						<li>Clear separation across projects and teams</li>
					</ul>
				</Card>
			</div>

			<div className="mt-2 grid gap-2 lg:grid-cols-[1.4fr_1fr]">
				<Card className="p-6 flex flex-col justify-center gap-2 hover:border-primary/50 transition-colors">
					<h4 className="font-medium flex items-center gap-2">
                        <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
						    <Check className="text-primary h-4 w-4" />
						</div>
						Good fit for
					</h4>
					<div className="flex flex-wrap gap-2 text-sm">
						<Badge className="rounded-full px-3 py-1" variant={"secondary"}>
							Web apps
						</Badge>
						<Badge className="rounded-full px-3 py-1" variant={"secondary"}>
							APIs
						</Badge>
						<Badge className="rounded-full px-3 py-1" variant={"secondary"}>
							Workers
						</Badge>
						<Badge className="rounded-full px-3 py-1" variant={"secondary"}>
							Game servers
						</Badge>
						<Badge className="rounded-full px-3 py-1" variant={"secondary"}>
							Side projects
						</Badge>
					</div>
				</Card>
				<Card className="p-6 flex flex-col justify-center gap-2 hover:border-primary/50 transition-colors">
					<h4 className="font-medium flex items-center gap-2">
                        <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
						    <List className="text-primary h-4 w-4" />
						</div>
						Requirements
					</h4>
					<div className="flex text-xs gap-2">
						<Badge
							className="rounded-full px-3 py-1 flex items-center flex-1 justify-center"
							variant={"secondary"}
						>
							Check out the README on Github
						</Badge>
						<Button size={"sm"} variant={"default"} className="rounded-full text-xs">
							<Github />
							Github
						</Button>
					</div>
				</Card>
			</div>
		</section>
	);
}
