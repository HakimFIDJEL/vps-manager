// Necessary imports
import { useAppearance } from "@/hooks/use-appearance";
import { Monitor, Moon, Sun } from "lucide-react";
import { HTMLAttributes } from "react";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AppearanceToggleDropdown({
	className = "",
	...props
}: HTMLAttributes<HTMLDivElement>) {
	const { appearance, setAppearance } = useAppearance();

	const getCurrentIcon = () => {
		switch (appearance) {
			case "dark":
				return <Moon className="h-5 w-5" />;
			case "light":
				return <Sun className="h-5 w-5" />;
			default:
				return <Monitor className="h-5 w-5" />;
		}
	};

	return (
		<div className={className} {...props}>
			<Tooltip>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
								{getCurrentIcon()}
								<span className="sr-only">Toggle theme</span>
							</Button>
						</TooltipTrigger>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => setAppearance("light")}
							disabled={appearance === "light"}
						>
							<span className="flex items-center gap-2">
								<Sun className="h-5 w-5" />
								Light
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setAppearance("dark")}
							disabled={appearance === "dark"}
						>
							<span className="flex items-center gap-2">
								<Moon className="h-5 w-5" />
								Dark
							</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => setAppearance("system")}
							disabled={appearance === "system"}
						>
							<span className="flex items-center gap-2">
								<Monitor className="h-5 w-5" />
								System
							</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<TooltipContent>
					<p>Change theme</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
