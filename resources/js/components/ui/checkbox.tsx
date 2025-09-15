"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

function Checkbox({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	const [isChecked, setIsChecked] = React.useState(
		props?.checked ?? props?.defaultChecked ?? false,
	);

	React.useEffect(() => {
		if (props?.checked !== undefined) setIsChecked(props.checked);
	}, [props?.checked]);

	const handleCheckedChange = React.useCallback(
		(checked: boolean) => {
			setIsChecked(checked);
			props.onCheckedChange?.(checked);
		},
		[props.onCheckedChange],
	);

	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
			onCheckedChange={handleCheckedChange}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="flex items-center justify-center text-current transition-none"
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					className="size-3.5"
					initial="unchecked"
					animate={isChecked ? "checked" : "unchecked"}
				>
					<motion.path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M4 12l5 5L20 6"
						variants={{
							checked: {
								pathLength: 1,
								opacity: 1,
								transition: {
									duration: 0.2,
									delay: 0.2,
								},
							},
							unchecked: {
								pathLength: 0,
								opacity: 0,
								transition: {
									duration: 0.2,
								},
							},
						}}
					/>
				</motion.svg>
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
