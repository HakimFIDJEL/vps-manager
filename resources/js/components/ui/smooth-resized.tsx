import * as React from "react";
import { useState, useRef, useEffect } from "react";
import autoAnimate from "@formkit/auto-animate";
import type { AnimationController } from "@formkit/auto-animate";
import {
	motion,
	AnimatePresence,
	TargetAndTransition,
	VariantLabels,
	LayoutGroup,
	MotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, PropsWithChildren } from "react";

function SmoothResize({
	className,
	children,
	...props
}: MotionProps & { className?: string; children?: React.ReactNode }) {
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

type SmoothItemProps = PropsWithChildren<
	MotionProps & { className?: string; layout?: boolean; delay?: number }
>;

const SmoothItem = forwardRef<HTMLDivElement, SmoothItemProps>(
	({ className, layout = true, delay = 0, children, ...rest }, ref) => (
		<motion.div
			ref={ref}
			layout={!!layout}
			className={className}
			initial={{ opacity: 0, scale: 0.99 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.3, ease: "easeInOut", delay }}
			exit={{ opacity: 0, scale: 0.99 }}
			{...rest}
		>
			{children}
		</motion.div>
	),
);

function SmoothAnimate({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const parent = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!parent.current) return;
		const controller: AnimationController = autoAnimate(parent.current, {
			duration: 400,
			easing: "ease-in-out",
		});
		return () => controller.destroy?.();
	}, []);

	return <div ref={parent} className={className} {...props} />;
}

export { SmoothResize, SmoothItem, SmoothAnimate };
