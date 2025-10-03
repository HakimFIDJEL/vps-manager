"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
	icon?: React.ReactNode;
}

export interface ComboboxProps {
	/**
	 * The options to display in the combobox
	 */
	options: ComboboxOption[];

	/**
	 * The current selected value (controlled)
	 */
	value?: string;

	/**
	 * The default value (uncontrolled)
	 */
	defaultValue?: string;

	/**
	 * Callback when the value changes
	 */
	onValueChange?: (value: string) => void;

	/**
	 * Placeholder text when no value is selected
	 */
	placeholder?: string;

	/**
	 * Placeholder text for the search input
	 */
	searchPlaceholder?: string;

	/**
	 * Message to display when no options match the search
	 */
	emptyMessage?: string;

	/**
	 * Whether the combobox is disabled
	 */
	disabled?: boolean;

	/**
	 * Custom className for the trigger button
	 */
	className?: string;

	/**
	 * Custom className for the popover content
	 */
	contentClassName?: string;

	/**
	 * Whether to allow deselecting the current value
	 */
	allowDeselect?: boolean;

	/**
	 * Custom icon for the trigger button
	 */
	icon?: React.ReactNode;

	/**
	 * Custom icon for selected items
	 */
	checkIcon?: React.ReactNode;

	/**
	 * Variant of the trigger button
	 */
	variant?:
		| "default"
		| "outline"
		| "ghost"
		| "secondary"
		| "destructive"
		| "link";

	/**
	 * Size of the trigger button
	 */
	size?: "default" | "sm" | "lg" | "icon";

	/**
	 * Whether to show the search input
	 */
	searchable?: boolean;

	/**
	 * Custom render function for the trigger content
	 */
	renderTrigger?: (
		selectedOption: ComboboxOption | undefined,
		isOpen: boolean,
	) => React.ReactNode;

	/**
	 * Custom render function for each option
	 */
	renderOption?: (
		option: ComboboxOption,
		isSelected: boolean,
	) => React.ReactNode;

	/**
	 * Group options by a key
	 */
	groups?: {
		label: string;
		options: ComboboxOption[];
	}[];

	/**
	 * Callback when the popover opens or closes
	 */
	onOpenChange?: (open: boolean) => void;

	/**
	 * Whether the popover is open (controlled)
	 */
	open?: boolean;

	/**
	 * Align the popover content
	 */
	align?: "start" | "center" | "end";

	/**
	 * Side of the trigger to place the popover
	 */
	side?: "top" | "right" | "bottom" | "left";

	/**
	 * Whether the combobox is in a loading state
	 * When true, displays a loading spinner instead of options
	 */
	loading?: boolean;

	/**
	 * Name attribute for form submission
	 * When provided, an hidden input will be created with this name
	 */
	name?: string;

	/**
	 * Whether the field is required for form validation
	 */
	required?: boolean;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
	(
		{
			options = [],
			value: controlledValue,
			defaultValue,
			onValueChange,
			placeholder = "Select an option...",
			searchPlaceholder = "Search...",
			emptyMessage = "No results found.",
			disabled = false,
			className,
			contentClassName,
			allowDeselect = false,
			icon,
			checkIcon,
			variant = "outline",
			size = "default",
			searchable = true,
			renderTrigger,
			renderOption,
			groups,
			onOpenChange,
			open: controlledOpen,
			align = "start",
			side = "bottom",
			loading = false,
			name,
			required = false,
		},
		ref,
	) => {
		const [internalOpen, setInternalOpen] = React.useState(false);
		const [internalValue, setInternalValue] = React.useState(defaultValue || "");

		// Determine if we're in controlled mode
		const isControlledValue = controlledValue !== undefined;
		const isControlledOpen = controlledOpen !== undefined;

		const open = isControlledOpen ? controlledOpen : internalOpen;
		const value = isControlledValue ? controlledValue : internalValue;

		const setOpen = React.useCallback(
			(newOpen: boolean) => {
				if (!isControlledOpen) {
					setInternalOpen(newOpen);
				}
				onOpenChange?.(newOpen);
			},
			[isControlledOpen, onOpenChange],
		);

		const setValue = React.useCallback(
			(newValue: string) => {
				if (!isControlledValue) {
					setInternalValue(newValue);
				}
				onValueChange?.(newValue);
			},
			[isControlledValue, onValueChange],
		);

		// Flatten options from groups if provided
		const allOptions = React.useMemo(() => {
			if (groups) {
				return groups.flatMap((group) => group.options);
			}
			return options;
		}, [options, groups]);

		const selectedOption = allOptions.find((option) => option.value === value);

		const handleSelect = React.useCallback(
			(selectedValue: string) => {
				const newValue =
					selectedValue === value && allowDeselect ? "" : selectedValue;
				setValue(newValue);
				setOpen(false);
			},
			[value, allowDeselect, setValue, setOpen],
		);

		const defaultTriggerContent = (
			<>
				{selectedOption ? (
					<div className="flex items-center gap-2">
						{selectedOption.icon}
						{selectedOption.label}
					</div>
				) : (
					placeholder
				)}
				{icon || <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
			</>
		);

		const triggerContent = renderTrigger
			? renderTrigger(selectedOption, open)
			: defaultTriggerContent;

		const renderOptions = (optionsToRender: ComboboxOption[]) => {
			return optionsToRender.map((option) => {
				const isSelected = value === option.value;
				const defaultOptionContent = (
					<>
						<div className="flex items-center gap-2">
							{option.icon}
							{option.label}
						</div>
						{checkIcon !== undefined ? (
							checkIcon
						) : (
							<Check
								className={cn(
									"ml-auto h-4 w-4",
									isSelected ? "opacity-100" : "opacity-0",
								)}
							/>
						)}
					</>
				);

				const optionContent = renderOption
					? renderOption(option, isSelected)
					: defaultOptionContent;

				return (
					<CommandItem
						key={option.value}
						value={option.value}
						onSelect={handleSelect}
						disabled={option.disabled}
					>
						{optionContent}
					</CommandItem>
				);
			});
		};

		return (
			<>
				{name && (
					<input type="hidden" name={name} value={value} required={required} />
				)}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							ref={ref}
							variant={variant}
							size={size}
							role="combobox"
							aria-expanded={open}
							disabled={disabled}
							className={cn("justify-between", className)}
						>
							{triggerContent}
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className={cn(
							"w-[var(--radix-popover-trigger-width)] p-0",
							contentClassName,
						)}
						align={align}
						side={side}
					>
						<Command>
							{searchable && (
								<CommandInput placeholder={searchPlaceholder} disabled={disabled || loading} className="h-9" />
							)}
							<CommandList>
								{loading ? (
									<div className="flex items-center justify-center py-6">
										<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
									</div>
								) : (
									<>
										<CommandEmpty>{emptyMessage}</CommandEmpty>
										{groups
											? groups.map((group) => (
													<CommandGroup key={group.label} heading={group.label}>
														{renderOptions(group.options)}
													</CommandGroup>
												))
											: options.length !== 0 && (
													<CommandGroup>{renderOptions(allOptions)}</CommandGroup>
												)}
									</>
								)}
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</>
		);
	},
);

Combobox.displayName = "Combobox";
