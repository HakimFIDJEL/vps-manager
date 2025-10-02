// components/page/home/hero.tsx

// Necessary imports
import { useAppearance } from "@/hooks/use-appearance";
import React from "react";

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
	ChevronDown,
} from "lucide-react";

export function Hero() {
	const { appearance } = useAppearance();

	const [isVisible, setIsVisible] = React.useState(true);

	React.useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY <= 200);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<section
			className="relative pb-32 lg:pb-16 pt-24 lg:pt-48 mb-18 lg:mb-0"
			id="hero"
		>
			<div className="relative z-10 mx-auto w-full">
				<div className="lg:w-[45%]">
					<div>
						<h1 className="max-w-sm text-balance text-4xl font-base md:text-5xl">
							VPS <br />
							Management <br />
							Simplified
						</h1>
						<p className="text-muted-foreground my-8 max-w-2xl text-balance text-lg font-light">
							Effortlessly orchestrate, monitor, and control all your VPS projects from
							one platform.
						</p>

						<div className="flex items-center gap-3">
							<Button size="lg" className="pr-4.5" asChild>
								<a href="#features">
									<span className="text-nowrap">Learn More</span>
									<ChevronRight className="opacity-50" />
								</a>
							</Button>
							<Button key={2} size="lg" variant="outline" className="pl-5" asChild>
								<a href="https://github.com/HakimFIDJEL/vps-manager" target="_blank">
									<Github />
									<span className="text-nowrap">Github</span>
								</a>
							</Button>
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

			{/* <div
				className={`hidden lg:block group absolute bottom-0 left-1/2 z-20 -translate-x-1/2 duration-500 p-0 bg-transparent transition-all border-none shadow-none hover:bg-transparent focus:ring-0 ${isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
			>
				<Button
					asChild
					className="bg-background ring ring-primary text-primary rounded-full hover:text-foreground transition-all focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 relative z-1"
				>
					<a
						href="#features"
						aria-label="Scroll down"
						className="group flex flex-col items-center relative"
					>
						Scroll down
					</a>
				</Button>

				<span className="mt-1 flex flex-col items-center absolute left-1/2 -translate-x-1/2">
					<ChevronDown
						className="h-6 w-6 text-primary group-hover:translate-y-0 translate-y-[-100%] transition-transform duration-300"
						strokeWidth={2}
					/>
				</span>
			</div> */}
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
