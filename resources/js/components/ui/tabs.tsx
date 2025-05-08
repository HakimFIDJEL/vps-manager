"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

// Context to provide animation settings and tab order
interface TabsContextProps {
	animate: boolean;
	currentValue: string;
	previousValue: string | null;
	triggerOrder: string[];
}
const TabsAnimateContext = React.createContext<TabsContextProps | null>(null);

export interface TabsProps
	extends React.ComponentProps<typeof TabsPrimitive.Root> {
	/** Enable or disable animated transitions between tabs */
	animate?: boolean;
}

function Tabs({ animate = true, className, children, ...props }: TabsProps) {
	// Extract triggers order from TabsList child
	const triggerOrder: string[] = [];
	React.Children.forEach(children, (child) => {
		if (!React.isValidElement(child)) return;

		if ((child.type as any).displayName === TabsList.displayName) {
			React.Children.forEach(child.props.children, (triggerNode) => {
				if (
					React.isValidElement<React.ComponentProps<typeof TabsTrigger>>(triggerNode)
				) {
					const val = triggerNode.props.value;
					if (typeof val === "string") {
						triggerOrder.push(val);
					}
				}
			});
		}
	});

	// Controlled state to track current and previous values
	const defaultValue = (props.defaultValue as string) || triggerOrder[0] || "";
	const [currentValue, setCurrentValue] = React.useState<string>(defaultValue);
	const previousValueRef = React.useRef<string | null>(null);

  

	const handleValueChange = (newValue: string) => {
		previousValueRef.current = currentValue;
		setCurrentValue(newValue);
		if (props.onValueChange) props.onValueChange(newValue);
	};

	return (
		<TabsAnimateContext.Provider
			value={{
				animate,
				currentValue,
				previousValue: previousValueRef.current,
				triggerOrder,
			}}
		>
			<TabsPrimitive.Root
				value={currentValue}
				onValueChange={handleValueChange}
				data-slot="tabs"
				className={cn("flex flex-col gap-2", className)}
				{...props}
			>
				{children}
			</TabsPrimitive.Root>
		</TabsAnimateContext.Provider>
	);
}

function TabsList({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				"bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
				className,
			)}
			{...props}
		/>
	);
}
TabsList.displayName = "TabsList";

function TabsTrigger({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"cursor-pointer data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		/>
	);
}
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps
	extends React.ComponentProps<typeof TabsPrimitive.Content> {
	className?: string;
}

function TabsContent({ className, children, ...props }: TabsContentProps) {
	const context = React.useContext(TabsAnimateContext);
	if (!context) return null;
	const { animate, currentValue, previousValue, triggerOrder } = context;
	const thisValue = (props as any).value as string;
	const isActive = thisValue === currentValue;
	if (!isActive) return null;

	// Determine direction based on index in triggerOrder
	const fromIndex = previousValue ? triggerOrder.indexOf(previousValue) : 0;
	const toIndex = triggerOrder.indexOf(thisValue);
	const direction = toIndex > fromIndex ? 1 : -1;

  

	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn("relative flex-1 outline-none", className)}
			{...props}
		>
			{animate ? (
				<AnimatePresence mode="wait" >
					<motion.div
						key={thisValue}
						initial={{ opacity: 0, x: 20 * direction }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 * direction }}
						transition={{ duration: 0.25 }}
					>
						{children}
					</motion.div>
				</AnimatePresence>
			) : (
				children
			)}
		</TabsPrimitive.Content>
	);
}
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
