"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { AnimatePresence, motion } from "framer-motion";
import { SmoothAnimate } from "@/components/ui/smooth-resized";


// Context to provide animation settings and tab order
interface TabsContextProps {
	currentValue: string;
	previousValue: string | null;
	triggerOrder: string[];
	isFirstRender: boolean;
	setCurrentValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextProps | null>(null);

// Hook pour utiliser le contexte des tabs
export function useTabsContext() {
	const context = React.useContext(TabsContext);
	if (!context) {
		throw new Error("useTabsContext doit être utilisé à l'intérieur d'un composant Tabs");
	}
	return context;
}

function Tabs({
	className,
	children,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
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
	const [isFirstRender, setIsFirstRender] = React.useState(true);

	const handleValueChange = (newValue: string) => {
		previousValueRef.current = currentValue;
		setCurrentValue(newValue);
		if (isFirstRender) {
			setIsFirstRender(false);
		}
		if (props.onValueChange) props.onValueChange(newValue);
	};

	return (
		<TabsContext.Provider
			value={{
				currentValue,
				previousValue: previousValueRef.current,
				triggerOrder,
				isFirstRender,
				setCurrentValue: handleValueChange,
			}}
		>
			<TabsPrimitive.Root
				value={currentValue}
				onValueChange={handleValueChange}
				data-slot="tabs"
				className={cn("flex flex-col gap-2 relative overflow-y-visible overflow-x-visible", className)}
				{...props}
			>
				{children}
			</TabsPrimitive.Root>
		</TabsContext.Provider>
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
				"dark:bg-muted bg-background text-muted-foreground border-border border inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] relative z-1",
				className,
			)}
			{...props}
		/>
	);
}
TabsList.displayName = "TabsList";

function TabsBody({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	const [ref] = useAutoAnimate<HTMLDivElement>({
		duration: 300,
	});

	return (
		<div 
			className={cn(
				"relative overflow-y-visible overflow-x-visible",
				className
			)} 
			{...props} 
			ref={ref}
		>
			{children}
		</div>
	);
}

function TabsTrigger({
	className,
	ref,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			ref={ref}
			className={cn(
				"cursor-pointer data-[state=active]:bg-primary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring  text-foreground dark:text-primary-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow,background] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm data-[state=active]:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 duration-300",
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
	const context = React.useContext(TabsContext);
	if (!context) return null;
	const { currentValue } = context;
	const thisValue = (props as any).value as string;
	const isActive = thisValue === currentValue;

	if(!isActive) {
		return null 
	} 

	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			{...props}
			className={cn(
				"w-full !data-[state=inactive]:static",
				className
			)}
		>
						{children}
		</TabsPrimitive.Content>
	);
}
TabsContent.displayName = "TabsContent";


export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBody };
