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
		throw new Error(
			"useTabsContext doit être utilisé à l'intérieur d'un composant Tabs",
		);
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
				className={cn(
					"flex flex-col gap-2 relative overflow-y-visible overflow-x-visible",
					className,
				)}
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
			className={cn("relative overflow-y-visible overflow-x-visible", className)}
			{...props}
			ref={ref}
		>
			{children}
		</div>
	);
}

// function TabsTrigger({
// 	className,
// 	ref,
// 	...props
// }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
// 	return (
// 		<TabsPrimitive.Trigger
// 			data-slot="tabs-trigger"
// 			ref={ref}
// 			className={cn(
// 				"cursor-pointer data-[state=active]:bg-primary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring  text-foreground dark:text-primary-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap !transition-[color,box-shadow,background] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm data-[state=active]:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 !duration-200",
// 				className,
// 			)}
// 			{...props}
// 		/>
// 	);
// }
const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
	return (
		<TabsPrimitive.Trigger
			ref={ref}
			data-slot="tabs-trigger"
			className={cn(
				"cursor-pointer data-[state=active]:bg-primary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring  text-foreground dark:text-primary-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap !transition-[color,box-shadow,background] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm data-[state=active]:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 !duration-200", // ta classe ici
				className,
			)}
			{...props}
		/>
	);
});

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

	if (!isActive) {
		return null;
	}

	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			{...props}
			className={cn("w-full !data-[state=inactive]:static", className)}
		>
			{children}
		</TabsPrimitive.Content>
	);
}
TabsContent.displayName = "TabsContent";

interface TabDefinition {
	value: string;
	label: string;
	icon?: JSX.Element;
}

function TabsNavigation({ tabs, className, ...props }: { className?: string, tabs: TabDefinition[] }) {
	const { currentValue } = useTabsContext();
	const [hoverStyle, setHoverStyle] = React.useState({});
	const [activeStyle, setActiveStyle] = React.useState({ left: "0px", width: "0px" });
	const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
	const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	// Animation of highlight
	React.useEffect(() => {
		if (hoveredIndex !== null) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
	
			const hoveredElement = tabRefs.current[hoveredIndex];
			if (hoveredElement) {
				const { offsetLeft, offsetWidth } = hoveredElement;
				setHoverStyle({
					left: `${offsetLeft}px`,
					width: `${offsetWidth}px`,
				});
			}
		}
	}, [hoveredIndex]);
	

	// Animation of indicator
	React.useEffect(() => {
		const activeIndex = tabs.findIndex((tab) => tab.value === currentValue);

		const activeElement = tabRefs.current[activeIndex];
		if (activeElement) {
			const { offsetLeft, offsetWidth } = activeElement;
			setActiveStyle({
				left: `${offsetLeft}px`,
				width: `${offsetWidth}px`,
			});
		}
	}, [currentValue]);

	return (
		<div className={`relative border-b ${className}`}>
			{/* Hover Highlight */}
			<div
				className="absolute h-full duration-200 bg-accent rounded-md flex items-center pointer-events-none"
				style={{
					...hoverStyle,
					opacity: hoveredIndex !== null ? 1 : 0,
				}}
			/>

			{/* Active Indicator */}
			<div
				className="absolute bottom-[-2px] h-[3px] bg-primary duration-200 pointer-events-none z-2 rounded-md"
				style={activeStyle}
			/>

			<TabsList
				className="!bg-transparent rounded-none h-auto p-0 space-x-[6px] relative border-0"
				onMouseLeave={() => {
					setHoveredIndex(null);
					timeoutRef.current = setTimeout(() => {
						setHoverStyle({});
					}, 200);
				}}
			>
				{tabs.map((tab, index) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						ref={(el) => (tabRefs.current[index] = el)}
						className="px-3 py-2 text-sm whitespace-nowrap !bg-transparent data-[state=inactive]:!text-muted-foreground data-[state=active]:text-foreground hover:bg-transparent data-[state=inactive]:hover:!text-foreground rounded-md duration-200 relative"
						onMouseEnter={() => {
							setHoveredIndex(index);
						}}
						onMouseLeave={() => setHoveredIndex(null)}
					>
            {tab.icon}
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
		</div>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBody, TabsNavigation };
