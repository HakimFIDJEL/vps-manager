// components/page/home/header.tsx

// Necessary imports
import { Link } from "@inertiajs/react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

// Custom components
import { Logo } from "@/components/layouts/logo";

// Icons
import { Linkedin, Twitter } from "lucide-react";

// Types
import { type Link as LinkType } from "@/pages/home";

export function Footer({ links }: { links: LinkType[] }) {
	return (
		<footer className="bg-background border-b pt-20">
			<div>
				<div className="grid gap-12 max-w-5xl px-6 mx-auto md:grid-cols-5">
					<div className="md:col-span-2 items-start flex">
						<Logo variant={"default"} color_scheme={"white"} />
					</div>

					<div className="col-span-3 grid grid-cols-3 gap-6">
						{links.map((link, index) => (
							<div key={index} className="space-y-4">
								<span className="block font-medium">{link.group}</span>
								{link.items.map((item, index) => (
									<div className="block m-0" key={index}>
										<Button
											variant={"link"}
											className="p-0 m-0 text-muted-foreground"
											asChild
										>
											<a href={item.href} className="">
												<span>{item.title}</span>
											</a>
										</Button>
									</div>
								))}
							</div>
						))}
					</div>
				</div>
				<div className="mt-12 border-t py-6">
					<div className="grid lg:grid-cols-3 grid-cols-1 items-center max-w-5xl px-6 mx-auto">
						<span className="text-muted-foreground text-sm justify-start text-start">
							© {new Date().getFullYear()} Vps Manager, All rights reserved.
						</span>
						<span className="text-muted-foreground text-sm justify-center lg:text-center text-start">
							Made by
							<Button
								variant={"link"}
								className="p-1 m-0 text-muted-foreground"
								asChild
							>
								<a href="https://hakimfidjel.fr" target="_blank">
									Hakim Fidjel
								</a>
							</Button>
						</span>
						<div className="flex lg:justify-end gap-2 text-sm justify-start">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button size={"icon"} variant={"ghost"} asChild>
										<a
											href="https://x.com/hakim_fidjel"
											target="_blank"
											rel="noopener noreferrer"
											aria-label="X/Twitter"
											className="text-muted-foreground"
										>
											<Twitter />
										</a>
									</Button>
								</TooltipTrigger>
								<TooltipContent>My Twitter</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button size={"icon"} variant={"ghost"} asChild>
										<a
											href="https://www.linkedin.com/in/hakim-fidjel/"
											target="_blank"
											aria-label="LinkedIn"
											className="text-muted-foreground"
										>
											<Linkedin />
										</a>
									</Button>
								</TooltipTrigger>
								<TooltipContent>My LinkedIn</TooltipContent>
							</Tooltip>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
