// components/pages/hero.tsx

// Necessary imports
import { Link } from "@inertiajs/react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";

// Icons
import { Github, Play } from "lucide-react";

export function HeroSection() {
	return (
		<div className="relative py-12 mt-12">
			<div className="mx-auto max-w-5xl px-6">
				<div>
					<h1 className="mt-8 max-w-2xl text-4xl lg:text-6xl">
						VPS Manager
					</h1>
					<p className="text-muted-foreground my-6 max-w-2xl text-balance text-xl font-light">
						Effortlessly orchestrate, monitor, and control all your VPS projects from
						one platform.
					</p>

					<div className="flex flex-col items-center gap-3 *:w-full sm:flex-row sm:*:w-fit">
						<Link href="#link">
							<Button size={"lg"} className="text-md">
								<span className="text-nowrap">Learn More</span>
							</Button>
						</Link>
						<Link href="#link">
							<Button size={"lg"} variant={"outline"} className="text-md">
								<Github />
								<span className="text-nowrap">Github</span>
							</Button>
						</Link>
					</div>
				</div>

				<div className="relative -mr-56 mt-16 sm:mr-0">
					<div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
						<div className="absolute inset-0 size-full object-cover bg-gradient-to-r  dark:from-primary/15 from-muted to-primary/70" />

						<div className="bg-background rounded-(--radius) relative m-4 overflow-hidden border border-transparent shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
							{/* Placeholder img */}
							<img
								src=""
								alt=""
								width="2880"
								height="1842"
								className="object-top-left size-full object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
