import { jsx } from "react/jsx-runtime";
import { ServerCrash, Cloud, Construction, Bug, Clock, Hourglass, FileWarning, ShieldAlert, Lock, AlertCircle, PlusCircle, CheckCircle, Zap, Play } from "lucide-react";
const statusData = {
  100: {
    title: "Continue",
    description: "The server has received the request headers and the client should proceed to send the request body.",
    icon: /* @__PURE__ */ jsx(Play, { className: "h-12 w-12 text-blue-500" })
  },
  101: {
    title: "Switching Protocols",
    description: "The server is switching protocols as requested by the client.",
    icon: /* @__PURE__ */ jsx(Zap, { className: "h-12 w-12 text-indigo-500" })
  },
  200: {
    title: "OK",
    description: "Everything worked as expected.",
    icon: /* @__PURE__ */ jsx(CheckCircle, { className: "h-12 w-12 text-green-500" })
  },
  201: {
    title: "Created",
    description: "Your resource was successfully created.",
    icon: /* @__PURE__ */ jsx(PlusCircle, { className: "h-12 w-12 text-green-600" })
  },
  202: {
    title: "Accepted",
    description: "Your request has been accepted for processing but is not completed yet.",
    icon: /* @__PURE__ */ jsx(Clock, { className: "h-12 w-12 text-blue-600" })
  },
  204: {
    title: "No Content",
    description: "The request was successful but there is no content to return.",
    icon: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-12 w-12 text-gray-500" })
  },
  400: {
    title: "Bad Request",
    description: "The server cannot process the request due to a client error.",
    icon: /* @__PURE__ */ jsx(AlertCircle, { className: "h-12 w-12 text-orange-500" })
  },
  401: {
    title: "Unauthorized",
    description: "You must be authenticated to access this resource.",
    icon: /* @__PURE__ */ jsx(Lock, { className: "h-12 w-12 text-red-500" })
  },
  403: {
    title: "Forbidden",
    description: "You don’t have permission to access this resource.",
    icon: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-12 w-12 text-red-600" })
  },
  404: {
    title: "Page Not Found",
    description: "The page you’re looking for doesn’t exist or has been moved.",
    icon: /* @__PURE__ */ jsx(FileWarning, { className: "h-12 w-12 text-amber-500" })
  },
  419: {
    title: "Page Expired",
    description: "The page has expired. Please refresh and try again.",
    icon: /* @__PURE__ */ jsx(Hourglass, { className: "h-12 w-12 text-blue-500" })
  },
  429: {
    title: "Too Many Requests",
    description: "You’ve sent too many requests in a short time. Please try again later.",
    icon: /* @__PURE__ */ jsx(Clock, { className: "h-12 w-12 text-amber-600" })
  },
  500: {
    title: "Internal Server Error",
    description: "Something went wrong on our end. We’re working to fix it.",
    icon: /* @__PURE__ */ jsx(Bug, { className: "h-12 w-12 text-red-500" })
  },
  501: {
    title: "Not Implemented",
    description: "This feature is planned but not implemented yet.",
    icon: /* @__PURE__ */ jsx(Construction, { className: "h-12 w-12 text-blue-500" })
  },
  502: {
    title: "Bad Gateway",
    description: "The server received an invalid response from an upstream server.",
    icon: /* @__PURE__ */ jsx(Cloud, { className: "h-12 w-12 text-gray-500" })
  },
  503: {
    title: "Service Unavailable",
    description: "The service is temporarily unavailable. Please try again later.",
    icon: /* @__PURE__ */ jsx(ServerCrash, { className: "h-12 w-12 text-red-500" })
  }
};
export {
  statusData
};
