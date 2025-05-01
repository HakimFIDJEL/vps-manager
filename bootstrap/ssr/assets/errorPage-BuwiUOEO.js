import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { g as getStatusTitle, P as PlaceholderPattern } from "./placeholder-pattern-C26DZVGi.js";
import { Head } from "@inertiajs/react";
import "react";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "./errorData-DbwWaEVk.js";
function Page({ statusCode }) {
  const statusTitle = getStatusTitle(statusCode);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: statusTitle }),
    /* @__PURE__ */ jsx(
      PlaceholderPattern,
      {
        className: "absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20 top-0 bottom-0",
        statusCode
      }
    )
  ] });
}
export {
  Page as default
};
