// components/pages/hero.tsx

// Necessary imports
import { Link } from "@inertiajs/react";
import { useAppearance } from "@/hooks/use-appearance";

// Shadcn UI Components
import { Button } from "@/components/ui/button";

// Icons
import {
	ChevronRight,
	Container,
	Github,
	KeyRound,
	Logs,
	Zap,
} from "lucide-react";
import { SmoothItem } from "@/components/ui/smooth-resized";

export function Hero() {
	const { appearance } = useAppearance();

	return (
		<section className="relative py-36">
			<div className="relative z-10 mx-auto w-full">
				<div className="md:w-[45%]">
					<div>
						<h1 className="max-w-sm text-balance text-4xl font-base md:text-5xl">
							VPS Management Simplified
						</h1>
						<p className="text-muted-foreground my-8 max-w-2xl text-balance text-lg font-light">
							Effortlessly orchestrate, monitor, and control all your VPS projects from
							one platform.
						</p>

						<div className="flex items-center gap-3">
							<a href="#link">
								<Button size="lg" className="pr-4.5">
									<span className="text-nowrap">Learn More</span>
									<ChevronRight className="opacity-50" />
								</Button>
							</a>
							<a href="https://github.com/HakimFIDJEL/vps-manager" target="_blank">
								<Button key={2} size="lg" variant="outline" className="pl-5">
									<Github />
									<span className="text-nowrap">Github</span>
								</Button>
							</a>
						</div>
					</div>

					<div className="mt-10 lg:w-[90%] w-full">
						<div className="grid grid-cols-2 text-sm text-muted-foreground mt-2">
							<div className="flex items-center gap-2 border-b border-r p-4">
								<Zap size={16} className="text-primary" /> Quick project setup
							</div>
							<div className="flex items-center gap-2 border-b p-4">
								<Container size={16} className="text-primary" /> Docker orchestration
							</div>
							<div className="flex items-center gap-2 border-r p-4">
								<KeyRound size={16} className="text-primary" /> Secure auth
							</div>
							<div className="flex items-center gap-2 p-4">
								<Logs size={16} className="text-primary" /> Real-time monitoring
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-[45%] md:top-40 md:mt-0 md:translate-x-0 relative">
				<div className="before:border-foreground/5 before:bg-foreground/5 absolute before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border aspect-16/9 w-[40rem] top-1/2 translate-y-[-50%]">
					<SmoothItem delay={0.5} layout={false}>
						<div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1 ">
							{appearance === "dark" && (
								<img
									src="assets/images/hero-dark.png"
									className="object-top-left size-full object-cover"
								/>
							)}

							{appearance === "light" && (
								<img
									src="assets/images/hero-light.png"
									className="object-top-left size-full object-cover"
								/>
							)}

							{appearance === "system" && (
								<img
									src={
										window.matchMedia("(prefers-color-scheme: dark)").matches
											? "assets/images/hero-dark.png"
											: "assets/images/hero-light.png"
									}
									className="object-top-left size-full object-cover"
								/>
							)}
						</div>
					</SmoothItem>
				</div>
			</div>
		</section>
	);
}
