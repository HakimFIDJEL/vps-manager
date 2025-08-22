"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  comment?: string
}

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, comment, ...props }, ref) => {
  return (
    <div className="w-full">
      <textarea
        data-slot="textarea"
        ref={ref}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}  // ici, on étale les props *sur* la balise
      />
      {comment && (
        <p className="mt-1 text-xs font-light leading-4 text-muted-foreground">
          {comment}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = "Textarea"
