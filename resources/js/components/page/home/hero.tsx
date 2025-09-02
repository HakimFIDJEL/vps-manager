// components/page/home/hero.tsx

// Necessary imports
import { useAppearance } from "@/hooks/use-appearance";

// Custom components
import { SmoothItem } from "@/components/ui/smooth-resized";

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

export function Hero() {
	const { appearance } = useAppearance();

	return (
		<section className="relative pb-24 pt-24 lg:pt-48 mb-18 lg:mb-0">
			<div className="relative z-10 mx-auto w-full">
				<div className="lg:w-[45%]">
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
						<div className="grid grid-cols-2 text-sm text-foreground mt-2">
							<Feature
								title="Quick project setup"
								icon={<Zap size={16} className="text-primary lg:block hidden" />}
								className="border-b border-r"
							/>
							<Feature
								title="Docker orchestration"
								icon={<Container size={16} className="text-primary lg:block hidden" />}
								className="border-b"
							/>
							<Feature
								title="Secure auth"
								icon={<KeyRound size={16} className="text-primary lg:block hidden" />}
								className="border-r"
							/>
							<Feature
								title="Real-time monitoring"
								icon={<Logs size={16} className="text-primary lg:block hidden" />}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="perspective-near mt-24 md:absolute md:-right-6 md:bottom-16 md:left-[45%] md:top-40 md:mt-0 md:translate-x-0 relative ">
				<div className="before:border-foreground/5 before:bg-gradient-to-t before:from-primary/50 before:to-muted absolute before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border aspect-16/9 w-auto lg:w-[40rem] lg:top-1/2 lg:translate-y-[-50%]">
					<SmoothItem delay={0.5} layout={false}>
						<div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1 ">
							{appearance === "dark" && (
								<img
									src="assets/images/show-dark.png"
									alt="Page - details of a project"
									className="object-top-left size-full object-cover"
								/>
							)}

							{appearance === "light" && (
								<img
									src="assets/images/show-light.png"
									alt="Page - details of a project"
									className="object-top-left size-full object-cover"
								/>
							)}

							{appearance === "system" && (
								<img
									src={
										window.matchMedia("(prefers-color-scheme: dark)").matches
											? "assets/images/show-dark.png"
											: "assets/images/show-light.png"
									}
									alt="Page - details of a project"
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

function Feature({
	title,
	icon,
	className,
}: {
	title: string;
	icon: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`flex items-center gap-2 lg:p-4 p-2 text-nowrap ${className}`}
		>
			{icon}
			{title}
		</div>
	);
}
