import * as React from "react";
import { useState, useRef, useEffect } from 'react'
import autoAnimate from "@formkit/auto-animate";
import { motion, AnimatePresence, TargetAndTransition, VariantLabels, LayoutGroup, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

function SmoothResize({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<motion.div
			layout
			className={cn("overflow-hidden", className)}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			{...props}
		>
			<AnimatePresence mode={"sync"}>{children}</AnimatePresence>
		</motion.div>
	);
}

type SmoothItemProps = React.ComponentProps<"div"> & MotionProps & {
	initial?: boolean | TargetAndTransition | VariantLabels | undefined;
	animate?: boolean | TargetAndTransition | VariantLabels | undefined;
	exit?: TargetAndTransition | VariantLabels | undefined;
}

function SmoothItem({ className, initial, animate, exit, ...props }: SmoothItemProps) {
	return (
		<motion.div
			layout
			className={className}
			transition={{
				duration: 0.3,
				ease: "easeInOut",
			}}
			initial={initial || { opacity: 0, scale: 0.95 }}
			animate={animate || { opacity: 1, scale: 1 }}
			exit={exit || { opacity: 0, scale: 0.95 }}
			{...props}
		/>
	);
}

function SmoothAnimate({ className, ...props }: React.ComponentProps<"div">) {
	const parent = useRef<HTMLDivElement>(null);

	useEffect(() => {
		parent.current && autoAnimate(parent.current, { duration: 300, easing: "ease-in-out" });
	}, [parent])

	return <div ref={parent} className={className} {...props} />;
}


export { SmoothResize, SmoothItem, SmoothAnimate };
