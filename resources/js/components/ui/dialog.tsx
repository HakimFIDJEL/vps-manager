"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { cn } from "@/lib/utils"

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

// Composant DialogSubmit complètement revu
const DialogSubmit = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
    onSubmit?: () => boolean | Promise<boolean>
  }
>(({ children, asChild = false, onSubmit, ...props }, forwardedRef) => {
  const closeRef = React.useRef<HTMLButtonElement>(null)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (onSubmit) {
      const shouldClose = await onSubmit()
      if (shouldClose && closeRef.current) {
        closeRef.current.click()
      }
    }
  }

  const Comp = asChild ? Slot : "button"

  return (
    <>
      <Comp {...props} ref={forwardedRef} onClick={handleClick}>
        {children}
      </Comp>
      <DialogPrimitive.Close ref={closeRef} className="hidden" aria-hidden="true" />
    </>
  )
})
DialogSubmit.displayName = "DialogSubmit"

// Correction du DialogOverlay pour utiliser forwardRef
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />
    {/* <div className="fixed z-50 left-[0%] top-[0%] w-[100vw] h-[100vh] flex justify-center"> */}
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          "bg-card fixed z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "sm:max-w-lg",
          "duration-200",
          "h-fit",
          "top-1/2",
          "left-1/2",
          "translate-x-[-50%]",
          "translate-y-[-50%]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    {/* </div> */}
  </DialogPortal>
))
DialogContent.displayName = "DialogContent"

const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }) => {
    const [ref] = useAutoAnimate<HTMLDivElement>({duration: 300});
    return (
      <div
        ref={ref}
        className={cn("flex flex-col overflow-hidden", className)}
        {...props}
      />
    )
  }
)

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn("text-lg leading-none font-semibold", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogSubmit,
}
