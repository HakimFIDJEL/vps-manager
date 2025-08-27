// components/pages/features.tsx

// Shadcn UI Components
import { Card } from "@/components/ui/card";

// Icons
import { Server, Boxes, Terminal, ShieldCheck } from "lucide-react";

export function FeaturesSection() {
	return (
		<section>
			<div className="py-24">
				<div className="mx-auto w-full max-w-5xl px-6">
					<div>
						<span className="text-primary">Core Capabilities</span>
						<h2 className="text-foreground mt-4 text-4xl">
							Everything you need to manage your VPS
						</h2>
						<p className="text-muted-foreground mb-12 mt-4 font-light">
							VPS Manager streamlines infrastructure management with powerful 
							orchestration features. From project setup to container lifecycle, 
							it makes complex operations effortless and secure.
						</p>
					</div>

					<div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Card className="overflow-hidden p-6 flex-col justify-between">
							<div>
								<Server className="text-primary size-5" />
								<h3 className="text-foreground mt-5 text-lg font-semibold">
									One-Click Project Setup
								</h3>
								<p className="text-muted-foreground mt-3 text-balance">
									Automatically generate a Makefile, Docker Compose, and .env 
									for every project, keeping environments consistent and reproducible.
								</p>
							</div>
							<div className="h-40 w-full mt-8">
								<img className="w-full h-full object-cover" />
							</div>
						</Card>

						<Card className="overflow-hidden p-6 flex-col justify-between">
							<div>
								<Boxes className="text-primary size-5" />
								<h3 className="text-foreground mt-5 text-lg font-semibold">
									Container Lifecycle Control
								</h3>
								<p className="text-muted-foreground mt-3 text-balance">
									Start, stop, remove, and monitor Docker containers directly 
									from the dashboard, no CLI required.
								</p>
							</div>
							<div className="h-40 w-full mt-8">
								<img className="w-full h-full object-cover" />
							</div>
						</Card>

						<Card className="overflow-hidden p-6 flex-col justify-between">
							<div>
								<Terminal className="text-primary size-5" />
								<h3 className="text-foreground mt-5 text-lg font-semibold">
									Secure Command Execution
								</h3>
								<p className="text-muted-foreground mt-3 text-balance">
									Leverage Laravel’s Process API, PAM, and sudo rules to 
									run system commands safely with the right user privileges.
								</p>
							</div>
							<div className="h-40 w-full mt-8">
								<img className="w-full h-full object-cover" />
							</div>
						</Card>

						<Card className="overflow-hidden p-6 flex-col justify-between">
							<div>
								<ShieldCheck className="text-primary size-5" />
								<h3 className="text-foreground mt-5 text-lg font-semibold">
									Role-Based Access
								</h3>
								<p className="text-muted-foreground mt-3 text-balance">
									Authentication is tied to Linux system users, ensuring 
									granular control and compliance-grade security.
								</p>
							</div>
							<div className="h-40 w-full mt-8">
								<img className="w-full h-full object-cover" />
							</div>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}

