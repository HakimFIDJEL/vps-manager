// components/page/home/header.tsx

// Necessary imports
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import React from "react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Custom components
import { Logo } from "@/components/layouts/logo";
import AppearanceToggleDropdown from "@/components/layouts/header/theme";

// Icons
import { LogIn } from "lucide-react";

// Types
import { type Link as LinkType } from "@/pages/home";

export function Header({ links }: { links: LinkType[] }) {
	const [menuState, setMenuState] = React.useState(false);
	const [isScrolled, setIsScrolled] = React.useState(false);

	React.useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<header>
			<nav
				data-state={menuState && "active"}
				className={cn(
					"fixed z-20 w-full transition-all duration-300 border-b border-transparent",
					isScrolled && "bg-background/75 border-border backdrop-blur-lg",
				)}
			>
				<div className="mx-auto max-w-5xl px-6">
					<div className="relative grid lg:grid-cols-3 grid-cols-2 items-center py-4 lg:py-3">
						<div className="flex justify-start">
							<Link href="/" aria-label="home" className="flex items-center space-x-2">
								<Logo variant={"default"} color_scheme={"default"} />
							</Link>
						</div>

						<div className="hidden justify-center lg:flex">
							<div className="m-auto hidden size-fit lg:block">
								<ul className="flex gap-1">
									{links
										.find((group) => group.group === "Product")
										?.items.map((item, index) => (
											<li key={index}>
												<Button asChild variant="ghost" size="sm">
													<Link href={item.href} className="text-sm text-muted-foreground">
														<span>{item.title}</span>
													</Link>
												</Button>
											</li>
										))}
								</ul>
							</div>
						</div>

						<div className="flex justify-end items-center gap-4">
							<AppearanceToggleDropdown />

							<Link href={route("auth.login")} className="lg:block hidden">
								<Button size={"sm"} variant={"default"} className="w-full lg:w-auto">
									<LogIn />
									<span>Login</span>
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}
