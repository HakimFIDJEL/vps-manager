// components/page/home/about.tsx

// Shadcn UI Components
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icons
import { Rocket, Terminal, Server, Cpu } from "lucide-react";

export function About() {
	return (
		<section className="py-8 lg:py-12" id="about">
			<h5 className="text-primary font-medium mb-3 text-sm bg-muted rounded-xl px-3 py-1 inline-block">
				About
			</h5>
			<h2 className="text-foreground text-balance text-3xl md:text-3xl">
				<span className="text-muted-foreground">Built from daily needs into</span> a scalable VPS toolkit
			</h2>

			<div className="mt-10 grid lg:gap-4 gap-2 lg:grid-cols-[1.4fr_1fr]">
				{/* Narrative – single wide card */}
				<Card className="p-6 lg:p-8 bg-card/50 hover:border-primary/50 transition-colors">
					<div className="mb-4 flex items-center gap-3">
						<div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
							<Rocket className="h-4 w-4" />
						</div>
						<Badge variant="outline" className="rounded-full h-7 px-2.5">
							Origin & Purpose
						</Badge>
					</div>

					<p className="text-muted-foreground text-sm leading-relaxed">
						VPS Manager began as a side project to tame real CLI friction on my own servers.
						It aims to run continuously on a VPS and host personal or team projects with
						clear guardrails and reproducible outcomes.
					</p>

					<Separator className="my-6" />

					<div className="grid gap-4 sm:grid-cols-3">
						<div className="space-y-2">
							<p className="text-sm font-medium">Why it exists</p>
							<ul className="text-muted-foreground text-sm space-y-1 list-disc pl-4">
								<li>Reduce context switching</li>
								<li>Make actions auditable</li>
								<li>Keep operations predictable</li>
							</ul>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Who it helps</p>
							<ul className="text-muted-foreground text-sm space-y-1 list-disc pl-4">
								<li>Solo developers</li>
								<li>Small teams</li>
								<li>Private servers</li>
							</ul>
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Scope today</p>
							<ul className="text-muted-foreground text-sm space-y-1 list-disc pl-4">
								<li>Compose-based projects</li>
								<li>Project-scoped actions</li>
								<li>Iterative roadmap</li>
							</ul>
						</div>
					</div>
				</Card>

				{/* Right column – two compact cards */}
				<div className="grid lg:gap-4 gap-2">
					<Card className="p-6 bg-card/50 hover:border-primary/50 transition-colors">
						<div className="mb-4 flex items-center gap-3">
							<div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
								<Cpu className="h-4 w-4" />
							</div>
							<Badge variant="outline" className="rounded-full h-7 px-2.5">
								Stack
							</Badge>
						</div>
						<div className="flex flex-wrap gap-2">
							<Badge variant="outline" className="rounded-full px-3 py-1 text-xs">Laravel 12</Badge>
							<Badge variant="outline" className="rounded-full px-3 py-1 text-xs">Inertia</Badge>
							<Badge variant="outline" className="rounded-full px-3 py-1 text-xs">React + TS</Badge>
							<Badge variant="outline" className="rounded-full px-3 py-1 text-xs">Python (exec)</Badge>
							<Badge variant="outline" className="rounded-full px-3 py-1 text-xs">Docker & Compose</Badge>
						</div>
					</Card>

					<Card className="p-6 bg-card/50 hover:border-primary/50 transition-colors">
						<div className="mb-4 flex items-center gap-3">
							<div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
								<Server className="h-4 w-4" />
							</div>
							<Badge variant="outline" className="rounded-full h-7 px-2.5">
								Runtime
							</Badge>
						</div>
						<ul className="text-muted-foreground text-sm space-y-2 list-disc pl-4">
							<li>Runs 24/7 on a server or VPS</li>
							<li>Uses Unix user permissions; sudo when required</li>
							<li>Designed to grow from personal to team use</li>
						</ul>

						<Separator className="my-6" />
						<div className="flex flex-wrap gap-2 text-xs">
							<span className="rounded-full bg-primary/10 text-primary px-3 py-1">Side project</span>
							<span className="rounded-full bg-primary/10 text-primary px-3 py-1">Scalable first</span>
							<span className="rounded-full bg-primary/10 text-primary px-3 py-1">Iterative</span>
						</div>
					</Card>
				</div>
			</div>

			<div className="mt-8">
				<Separator className="bg-gradient-to-r from-transparent via-primary to-transparent h-[1px]" />
			</div>
		</section>
	);
}

