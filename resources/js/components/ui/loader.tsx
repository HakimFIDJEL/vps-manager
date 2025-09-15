import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoaderProps {
  isVisible: boolean
}

export function Loader({ isVisible }: LoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "bg-muted/50 backdrop-blur-sm",
        "transition-opacity duration-300",
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center transform transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    </div>
  )
}
