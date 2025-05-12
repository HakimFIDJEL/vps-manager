import type React from "react"
import { useId } from "react"
import { 
  ArrowRight,
  Bug,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { statusData, type StatusEntry } from "@/pages/errors/errorData"
import { Link } from "@inertiajs/react"

interface PlaceholderPatternProps {
  className?: string
  statusCode?: number | null
  displayButton?: boolean
}

function getStatusContent(code: number | null): StatusEntry {
  return statusData[code ?? 501] ?? {
    title: `Status code : ${code}`,
    description: "This status code is not defined in our system.",
    icon: <Bug className="h-12 w-12 text-gray-500" />,
  }
}

export function getStatusTitle(statusCode: number | null): string {
  return getStatusContent(statusCode).title
}

export function PlaceholderPattern({ className, statusCode, displayButton = false }: PlaceholderPatternProps) {
  const patternId = useId()

  const content = getStatusContent(statusCode ?? null)

  return (
    <div className={`overflow-hidden ${className || ""}`}>
      <svg className="absolute inset-0 w-full h-full" fill="none">
        <defs>
          <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" className="stroke-current opacity-20"></path>
          </pattern>
        </defs>
        <rect stroke="none" fill={`url(#${patternId})`} width="100%" height="100%"></rect>
      </svg>

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {content && statusCode && (

          <Card className="relative">
                <div className="text-gray-500 dark:text-gray-400 absolute bottom-2 right-2 text-xs font-medium">
                  Status code: {statusCode ?? 'N/A'}
                </div>
            <CardContent>
              <div className="text-center p-6 max-w-md">
                <div className="flex justify-center mb-4">{content.icon}</div>
                <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3   ">{content.description}</p>
                {displayButton && (
                  <Link href={route('dashboard') ?? "/"}>
                      <Button variant={'outline'}>
                          Go to Home 
                          <ArrowRight className="h-4 w-4" />
                      </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
          
      </div>
    </div>
  )
}
