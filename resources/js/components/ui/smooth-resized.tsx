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
			className={cn("", className)}
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
	delay?: number;
	layout?: boolean | "size" | "position" | "preserve-aspect" | "preserve-aspect-size";
}

function SmoothItem({ className, layout=true, initial, delay, animate, exit, ...props }: SmoothItemProps) {
	return (
		<motion.div
			layout={layout ? layout : false}
			className={className}
			transition={{
				duration: 0.3,
				ease: "easeInOut",
				delay: delay ? delay : 0,
			}}
			initial={initial || { opacity: 0, scale: 0.99, }}
			animate={animate || { opacity: 1, scale: 1 }}
			exit={exit || { opacity: 0, scale: 0.99 }}
			{...props}
		/>
	);
}

function SmoothAnimate({ className, ...props }: React.ComponentProps<"div">) {
	const parent = useRef<HTMLDivElement>(null);

	useEffect(() => {
		parent.current && autoAnimate(parent.current, { duration: 200, easing: "ease-in-out" });
	}, [parent])

	return <div ref={parent} className={className} {...props} />;
}


export { SmoothResize, SmoothItem, SmoothAnimate };
