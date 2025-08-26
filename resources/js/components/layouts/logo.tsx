import { Boxes } from "lucide-react";

export function Logo({
	variant = "mini",
	color_scheme = "default",
	className,
}: {
	variant?: "mini" | "default";
	color_scheme?: "default" | "white";
	className?: string;
}) {
	return variant === "mini" ? (
		// <div className={`bg-sidebar-primary  text-white flex aspect-square size-8 items-center justify-center rounded-lg mr-2 ${className}`}>
		// 	<Boxes className="h-5 w-5 text-white" />
		// </div>
		<div
			className={`
				${color_scheme === 'white' ? 'bg-card border text-foreground' : 'bg-primary text-white'} 
				flex aspect-square size-9 items-center justify-center rounded-lg ${className}
				`}
		>
			<Boxes strokeWidth={1.5} className="h-6 w-6 " />
		</div>
	) : (
		<div
			className={`
				${color_scheme === 'white' ? 'text-white' : ' text-foreground'} 
				flex items-center justify-center rounded-lg mr-2 ${className} gap-2
				`}
		>
			<Boxes 
				className={`h-6 w-6 ${color_scheme === 'white' ? '' : 'text-primary '}`} 
				strokeWidth={1.75} 
			/>
			<span className="pb-0.5 ">vps manager</span>
		</div>
	);
}
