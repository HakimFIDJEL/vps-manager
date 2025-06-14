"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Slot } from "@radix-ui/react-slot";
import {
	ArrowLeft,
	ArrowRight,
	CheckIcon,
	LoaderCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";

// Types
type StepperContextValue = {
	activeStep: number;
	setActiveStep: (step: number) => void;
	totalSteps: number;
	orientation: "horizontal" | "vertical";
	previousStep: number | null;
};

type StepItemContextValue = {
	step: number;
	state: StepState;
	isDisabled: boolean;
	isLoading: boolean;
};

type StepState = "active" | "completed" | "inactive" | "loading";

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(
	undefined,
);
const StepItemContext = createContext<StepItemContextValue | undefined>(
	undefined,
);

const useStepper = () => {
	const context = useContext(StepperContext);
	if (!context) {
		throw new Error("useStepper must be used within a Stepper");
	}
	return context;
};

const useStepItem = () => {
	const context = useContext(StepItemContext);
	if (!context) {
		throw new Error("useStepItem must be used within a StepperItem");
	}
	return context;
};

// Components
interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
	defaultValue?: number;
	value?: number;
	onValueChange?: (value: number) => void;
	orientation?: "horizontal" | "vertical";
	totalSteps: number;
}

function Stepper({
	defaultValue = 0,
	value,
	onValueChange,
	orientation = "horizontal",
	totalSteps,
	className,
	...props
}: StepperProps) {
	const [activeStep, setInternalStep] = React.useState(defaultValue);
	const [previousStep, setPreviousStep] = React.useState<number | null>(null);

	const setActiveStep = React.useCallback(
		(step: number) => {
			setPreviousStep(activeStep);
			if (value === undefined) {
				setInternalStep(step);
			}
			onValueChange?.(step);
		},
		[value, onValueChange, activeStep],
	);

	const currentStep = value ?? activeStep;

	return (
		<StepperContext.Provider
			value={{
				activeStep: currentStep,
				setActiveStep,
				orientation,
				totalSteps,
				previousStep,
			}}
		>
			<div
				data-slot="stepper"
				className={cn(
					"group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row",
					className,
				)}
				data-orientation={orientation}
				{...props}
			/>
		</StepperContext.Provider>
	);
}

// StepperItem
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
	step: number;
	completed?: boolean;
	disabled?: boolean;
	loading?: boolean;
}

function StepperItem({
	step,
	completed = false,
	disabled = false,
	loading = false,
	className,
	children,
	...props
}: StepperItemProps) {
	const { activeStep } = useStepper();

	const state: StepState =
		completed || step < activeStep
			? "completed"
			: activeStep === step
				? "active"
				: "inactive";

	const isLoading = loading && step === activeStep;

	return (
		<StepItemContext.Provider
			value={{ step, state, isDisabled: disabled, isLoading }}
		>
			<div
				data-slot="stepper-item"
				className={cn(
					"group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
					className,
				)}
				data-state={state}
				{...(isLoading ? { "data-loading": true } : {})}
				{...props}
			>
				{children}
			</div>
		</StepItemContext.Provider>
	);
}

// StepperTrigger
interface StepperTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	asChild?: boolean;
	clickable?: boolean;
}

function StepperTrigger({
	asChild = false,
	clickable = false,
	className,
	children,
	...props
}: StepperTriggerProps) {
	const { setActiveStep } = useStepper();
	const { step, isDisabled } = useStepItem();

	if (asChild) {
		const Comp = asChild ? Slot : "span";
		return (
			<Comp data-slot="stepper-trigger" className={className}>
				{children}
			</Comp>
		);
	}

	return (
		<button
			data-slot="stepper-trigger"
			className={cn(
				"focus-visible:border-ring focus-visible:ring-ring/50 inline-flex items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			onClick={clickable ? () => setActiveStep(step) : undefined}
			disabled={isDisabled}
			{...props}
		>
			{children}
		</button>
	);
}

// StepperIndicator
interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean;
}

function StepperIndicator({
	asChild = false,
	className,
	children,
	...props
}: StepperIndicatorProps) {
	const { state, step, isLoading } = useStepItem();

	return (
		<span
			data-slot="stepper-indicator"
			className={cn(
				"dark:bg-muted bg-background dark:border-0 border border-border text-muted-foreground dark:data-[state=active]:bg-primary data-[state=active]:bg-primary dark:data-[state=completed]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all duration-300",
				className,
			)}
			data-state={state}
			{...props}
		>
			{asChild ? (
				children
			) : (
				<>
					<span className="transition-all group-data-loading/step:scale-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0">
						{step}
					</span>
					<CheckIcon
						className="absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
						size={16}
						aria-hidden="true"
					/>
					{isLoading && (
						<span className="absolute transition-all">
							<LoaderCircleIcon
								className="animate-spin"
								size={14}
								aria-hidden="true"
							/>
						</span>
					)}
				</>
			)}
		</span>
	);
}

// StepperTitle
function StepperTitle({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			data-slot="stepper-title"
			className={cn("text-sm font-medium", className)}
			{...props}
		/>
	);
}

// StepperDescription
function StepperDescription({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			data-slot="stepper-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

// StepperSeparator
function StepperSeparator({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="stepper-separator"
			className={cn(
				"group-data-[state=completed]/step:bg-primary dark:group-data-[state=completed]/step:bg-primary dark:bg-muted bg-background  m-0.5 group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=horizontal]/stepper:flex-1 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=vertical]/stepper:w-0.5 transition-all duration-300",
				className,
			)}
			{...props}
		/>
	);
}

function StepperBody({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	const [ref] = useAutoAnimate<HTMLDivElement>({
		duration: 300,
		easing: "ease-in-out",
	});

	return (
		<div className={cn("relative", className)} {...props} ref={ref}>
			{children}
		</div>
	);
}

// Ajouter l'interface StepperContentProps après StepperSeparator
interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: number;
}

// Ajouter le composant StepperContent avec animation
function StepperContent({
	value,
	className,
	children,
	...props
}: StepperContentProps) {
	const { activeStep, previousStep } = useStepper();
	const isActive = activeStep === value;

	const [isMounted, setIsMounted] = React.useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const direction =
		previousStep !== null ? (activeStep > previousStep ? 1 : -1) : 1;

	if (!isActive) return null;

	return (
		<div
			className={cn(className)}
			{...props}
			data-slot="stepper-content"
			data-state={isActive ? "active" : "inactive"}
		>
			{children}
		</div>
	);
}

// Ajouter le composant StepperList
function StepperList({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { orientation } = useStepper();

	return (
		<div
			data-slot="stepper-list"
			data-orientation={orientation}
			className={cn(
				"inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
				className,
			)}
			{...props}
		/>
	);
}

interface StepperNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
	nextButton?: React.ReactNode;
	onNext?: () => boolean | Promise<boolean>;
}

function StepperNavigation({
	className,
	nextButton,
	onNext,
	...props
}: StepperNavigationProps) {
	const { activeStep, setActiveStep, totalSteps } = useStepper();
	const [isLoading, setIsLoading] = useState(false);

	const handleNext = async () => {
		if (!onNext) {
			if (activeStep === totalSteps) {
				return;
			}
			setActiveStep(activeStep + 1);
			return;
		}

		setIsLoading(true);
		try {
			const result = await onNext();
			if (result) {
				if (activeStep === totalSteps) {
					return;
				}
				setActiveStep(activeStep + 1);
			}
		} catch (error) {
			// On ne fait rien ici car l'erreur est déjà gérée dans le composant parent
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			data-slot="stepper-navigation"
			className={cn("flex items-center justify-between gap-2", className)}
			{...props}
		>
			<Button
				onClick={() => setActiveStep(activeStep - 1)}
				disabled={activeStep === 1 || isLoading}
				variant={"default"}
				size={"sm"}
				type="button"
			>
				<ArrowLeft />
				Previous
			</Button>
			{nextButton ? (
				<div onClick={handleNext}>{nextButton}</div>
			) : (
				<Button
					onClick={handleNext}
					disabled={isLoading}
					variant={"default"}
					size={"sm"}
					type="button"
				>
					Next
					{isLoading ? (
						<LoaderCircleIcon className="animate-spin" />
					) : (
						<ArrowRight />
					)}
				</Button>
			)}
		</div>
	);
}

// Modifier l'export pour inclure les nouveaux composants
export {
	Stepper,
	StepperContent,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperList,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
	StepperNavigation,
	StepperBody,
};
