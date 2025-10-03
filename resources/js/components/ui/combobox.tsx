"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  /**
   * The options to display in the combobox
   */
  options: ComboboxOption[]

  /**
   * The current selected value (controlled)
   */
  value?: string

  /**
   * The default value (uncontrolled)
   */
  defaultValue?: string

  /**
   * Callback when the value changes
   */
  onValueChange?: (value: string) => void

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string

  /**
   * Placeholder text for the search input
   */
  searchPlaceholder?: string

  /**
   * Message to display when no options match the search
   */
  emptyMessage?: string

  /**
   * Whether the combobox is disabled
   */
  disabled?: boolean

  /**
   * Custom className for the trigger button
   */
  className?: string

  /**
   * Custom className for the popover content
   */
  contentClassName?: string

  /**
   * Width of the combobox (applies to both trigger and content)
   * @default "auto" - adapts to content
   */
  width?: string | number

  /**
   * Whether to allow deselecting the current value
   */
  allowDeselect?: boolean

  /**
   * Custom icon for the trigger button
   */
  icon?: React.ReactNode

  /**
   * Custom icon for selected items
   */
  checkIcon?: React.ReactNode

  /**
   * Variant of the trigger button
   */
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"

  /**
   * Size of the trigger button
   */
  size?: "default" | "sm" | "lg" | "icon"

  /**
   * Whether to show the search input
   */
  searchable?: boolean

  /**
   * Custom render function for the trigger content
   */
  renderTrigger?: (selectedOption: ComboboxOption | undefined, isOpen: boolean) => React.ReactNode

  /**
   * Custom render function for each option
   */
  renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode

  /**
   * Group options by a key
   */
  groups?: {
    label: string
    options: ComboboxOption[]
  }[]

  /**
   * Callback when the popover opens or closes
   */
  onOpenChange?: (open: boolean) => void

  /**
   * Whether the popover is open (controlled)
   */
  open?: boolean

  /**
   * Align the popover content
   */
  align?: "start" | "center" | "end"

  /**
   * Side of the trigger to place the popover
   */
  side?: "top" | "right" | "bottom" | "left"

  /**
   * Whether the combobox is in a loading state
   * When true, displays a loading spinner instead of options
   */
  loading?: boolean
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
      width,
      allowDeselect = true,
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
      loading = false, // Added loading parameter with default value
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")

    // Determine if we're in controlled mode
    const isControlledValue = controlledValue !== undefined
    const isControlledOpen = controlledOpen !== undefined

    const open = isControlledOpen ? controlledOpen : internalOpen
    const value = isControlledValue ? controlledValue : internalValue

    const setOpen = React.useCallback(
      (newOpen: boolean) => {
        if (!isControlledOpen) {
          setInternalOpen(newOpen)
        }
        onOpenChange?.(newOpen)
      },
      [isControlledOpen, onOpenChange],
    )

    const setValue = React.useCallback(
      (newValue: string) => {
        if (!isControlledValue) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlledValue, onValueChange],
    )

    // Flatten options from groups if provided
    const allOptions = React.useMemo(() => {
      if (groups) {
        return groups.flatMap((group) => group.options)
      }
      return options
    }, [options, groups])

    const selectedOption = allOptions.find((option) => option.value === value)

    const handleSelect = React.useCallback(
      (selectedValue: string) => {
        const newValue = selectedValue === value && allowDeselect ? "" : selectedValue
        setValue(newValue)
        setOpen(false)
      },
      [value, allowDeselect, setValue, setOpen],
    )

    const widthStyle = width ? (typeof width === "number" ? `${width}px` : width) : undefined

    const defaultTriggerContent = (
      <>
        {selectedOption ? selectedOption.label : placeholder}
        {icon || <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
      </>
    )

    const triggerContent = renderTrigger ? renderTrigger(selectedOption, open) : defaultTriggerContent

    const renderOptions = (optionsToRender: ComboboxOption[]) => {
      return optionsToRender.map((option) => {
        const isSelected = value === option.value
        const defaultOptionContent = (
          <>
            {option.label}
            {checkIcon !== undefined ? (
              checkIcon
            ) : (
              <Check className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
            )}
          </>
        )

        const optionContent = renderOption ? renderOption(option, isSelected) : defaultOptionContent

        return (
          <CommandItem key={option.value} value={option.value} onSelect={handleSelect} disabled={option.disabled}>
            {optionContent}
          </CommandItem>
        )
      })
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant={variant}
            size={size}
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("justify-between", !width && "w-fit min-w-[200px]", className)}
            style={widthStyle ? { width: widthStyle } : undefined}
          >
            {triggerContent}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("p-0", contentClassName)}
          style={{ width: widthStyle || "200px" }}
          align={align}
          side={side}
        >
          <Command>
            {searchable && <CommandInput placeholder={searchPlaceholder} className="h-9" />}
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  {groups ? (
                    groups.map((group) => (
                      <CommandGroup key={group.label} heading={group.label}>
                        {renderOptions(group.options)}
                      </CommandGroup>
                    ))
                  ) : (
                    <CommandGroup>{renderOptions(allOptions)}</CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

Combobox.displayName = "Combobox"
