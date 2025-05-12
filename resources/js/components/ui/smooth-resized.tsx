import * as React from "react";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { MagicMotion } from "react-magic-motion";

function SmoothResize({
	children,
	className,
	...props
}: React.ComponentProps<"div">) {
	// const [ref] = useAutoAnimate<HTMLDivElement>({
	//   duration: 300,
	// });

	return (

		<MagicMotion  
      transition={{ 
        // type d’animation : "tween" (par défaut), "spring", "keyframes", "inertia" ou false (instantané)
        type: "tween",
        duration: 0.3,
      }}
    >
			<div className={cn("overflow-hidden", className)} {...props}>{children}</div>
		</MagicMotion>
	);
}

export { SmoothResize };
