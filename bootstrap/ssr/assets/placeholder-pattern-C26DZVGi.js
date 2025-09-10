import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useId } from "react";
import { ArrowRight, Bug } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { statusData } from "./errorData-DbwWaEVk.js";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
});
Button.displayName = "Button";
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function getStatusContent(code) {
  return statusData[code ?? 501] ?? {
    title: `Status code : ${code}`,
    description: "This status code is not defined in our system.",
    icon: /* @__PURE__ */ jsx(Bug, { className: "h-12 w-12 text-gray-500" })
  };
}
function getStatusTitle(statusCode) {
  return getStatusContent(statusCode).title;
}
function PlaceholderPattern({ className, statusCode }) {
  const patternId = useId();
  const content = getStatusContent(statusCode ?? null);
  return /* @__PURE__ */ jsxs("div", { className: `overflow-hidden ${className || ""}`, children: [
    /* @__PURE__ */ jsxs("svg", { className: "absolute inset-0 w-full h-full", fill: "none", children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsx("pattern", { id: patternId, x: "0", y: "0", width: "10", height: "10", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx("path", { d: "M-3 13 15-5M-5 5l18-18M-1 21 17 3", className: "stroke-current opacity-20" }) }) }),
      /* @__PURE__ */ jsx("rect", { stroke: "none", fill: `url(#${patternId})`, width: "100%", height: "100%" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 flex items-center justify-center w-full h-full", children: content && /* @__PURE__ */ jsx(Card, { className: "relative", children: /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-center p-6 max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-gray-500 dark:text-gray-400 absolute bottom-2 right-2 text-xs font-medium", children: [
        "Status code: ",
        statusCode ?? "N/A"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: content.icon }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2", children: content.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-3   ", children: content.description }),
      /* @__PURE__ */ jsx("a", { href: "/", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
        "Go to Home",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
      ] }) })
    ] }) }) }) })
  ] });
}
export {
  Button as B,
  PlaceholderPattern as P,
  cn as c,
  getStatusTitle as g
};
