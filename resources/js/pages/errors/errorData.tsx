import React, { ReactNode } from "react"
import {
  AlertCircle,
  Lock,
  ShieldAlert,
  FileWarning,
  Hourglass,
  Clock,
  Bug,
  Construction,
  Cloud,
  ServerCrash,
  Hammer,
  CheckCircle,
  PlusCircle,
  Play,
  Zap,
} from "lucide-react"

export interface StatusEntry {
  title: string
  description: string
  icon: ReactNode
}

export const statusData: Record<number, StatusEntry> = {
  100: {
    title: "Continue",
    description: "The server has received the request headers and the client should proceed to send the request body.",
    icon: <Play className="h-12 w-12 text-blue-500" />,
  },
  101: {
    title: "Switching Protocols",
    description: "The server is switching protocols as requested by the client.",
    icon: <Zap className="h-12 w-12 text-indigo-500" />,
  },
  200: {
    title: "OK",
    description: "Everything worked as expected.",
    icon: <CheckCircle className="h-12 w-12 text-green-500" />,
  },
  201: {
    title: "Created",
    description: "Your resource was successfully created.",
    icon: <PlusCircle className="h-12 w-12 text-green-600" />,
  },
  202: {
    title: "Accepted",
    description: "Your request has been accepted for processing but is not completed yet.",
    icon: <Clock className="h-12 w-12 text-blue-600" />,
  },
  204: {
    title: "No Content",
    description: "The request was successful but there is no content to return.",
    icon: <ShieldAlert className="h-12 w-12 text-gray-500" />,
  },
  400: {
    title: "Bad Request",
    description: "The server cannot process the request due to a client error.",
    icon: <AlertCircle className="h-12 w-12 text-orange-500" />,
  },
  401: {
    title: "Unauthorized",
    description: "You must be authenticated to access this resource.",
    icon: <Lock className="h-12 w-12 text-red-500" />,
  },
  403: {
    title: "Forbidden",
    description: "You don’t have permission to access this resource.",
    icon: <ShieldAlert className="h-12 w-12 text-red-600" />,
  },
  404: {
    title: "Page Not Found",
    description: "The page you’re looking for doesn’t exist or has been moved.",
    icon: <FileWarning className="h-12 w-12 text-amber-500" />,
  },
  419: {
    title: "Page Expired",
    description: "The page has expired. Please refresh and try again.",
    icon: <Hourglass className="h-12 w-12 text-blue-500" />,
  },
  429: {
    title: "Too Many Requests",
    description: "You’ve sent too many requests in a short time. Please try again later.",
    icon: <Clock className="h-12 w-12 text-amber-600" />,
  },
  500: {
    title: "Internal Server Error",
    description: "Something went wrong on our end. We’re working to fix it.",
    icon: <Bug className="h-12 w-12 text-red-500" />,
  },
  501: {
    title: "Not Implemented",
    description: "This feature is planned but not implemented yet.",
    icon: <Construction className="h-12 w-12 text-blue-500" />,
  },
  502: {
    title: "Bad Gateway",
    description: "The server received an invalid response from an upstream server.",
    icon: <Cloud className="h-12 w-12 text-gray-500" />,
  },
  503: {
    title: "Service Unavailable",
    description: "The service is temporarily unavailable. Please try again later.",
    icon: <ServerCrash className="h-12 w-12 text-red-500" />,
  },
}
