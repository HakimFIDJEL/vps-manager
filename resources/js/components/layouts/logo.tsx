import { Boxes } from "lucide-react";

export function Logo({ variant = "mini", className }: { variant?: "mini" | "default"; className?: string }) {
	return variant === "mini" ? (
		<div className={`bg-sidebar-primary  text-white flex aspect-square size-8 items-center justify-center rounded-lg mr-2 ${className}`}>
			<Boxes className="h-5 w-5 text-white" />
		</div>
	) : (
		<div className={`text-white flex items-center justify-center rounded-lg mr-2 ${className} gap-2`}>
			<Boxes className="h-5 w-5" />
            <span className="text-base ">vps manager</span>
		</div>
	);
}
