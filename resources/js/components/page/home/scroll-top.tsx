// components/page/home/scroll-top.tsx

// Necessary imports
import React from "react";

// Icons
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function ScrollTop() {
	const [isVisible, setIsVisible] = React.useState(false);

	React.useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > 300);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="fixed bottom-8 right-4 sm:right-12 z-50">
					<Button
						className={`transition-all duration-500 size-10 rounded-full transform ${isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}`}
						asChild
					>
						<a href="#top" aria-label="Scroll to top">
							<ArrowUp className="size-4" />
						</a>
					</Button>
				</div>
			</TooltipTrigger>
			<TooltipContent>Scroll to top</TooltipContent>
		</Tooltip>
	);
}
