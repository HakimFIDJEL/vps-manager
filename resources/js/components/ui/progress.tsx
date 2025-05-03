import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

// 1) On forwarde la ref vers le Root de Radix
const Progress = React.forwardRef<
  // Type du nœud DOM émis par ProgressPrimitive.Root (généralement un <div>)
  React.ElementRef<typeof ProgressPrimitive.Root>,
  // Props sans ref que prend ProgressPrimitive.Root
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}                          // 2) on attache ici la ref reçue
    data-slot="progress"
    className={cn(
      "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className="bg-primary h-full w-full flex-1 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))  

// 3) DisplayName pour l’outillage React (ex. DevTools)
Progress.displayName = "Progress"

export { Progress }
