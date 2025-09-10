import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { Fragment as Fragment$1, useState, useCallback, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { XIcon, PanelLeft, ChevronRight, User, ArrowUpCircleIcon, LayoutDashboard, Folder, Container, Network, Archive, SquareActivity, SquareTerminal, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { c as cn, B as Button, P as PlaceholderPattern } from "./placeholder-pattern-C26DZVGi.js";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { Link, Head } from "@inertiajs/react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import "clsx";
import "tailwind-merge";
import "./errorData-DbwWaEVk.js";
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator-root",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    TooltipPrimitive.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { className: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = React.forwardRef(
  ({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [openMenu, setOpenMenu] = React.useState(null);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );
    const toggleSidebar = React.useCallback(() => {
      if (!isMobile) {
        setOpenMenu(null);
      }
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile, setOpenMenu]);
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);
    const state = open ? "expanded" : "collapsed";
    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        openMenu,
        setOpenMenu
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, openMenu, setOpenMenu]
    );
    return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        ),
        ref,
        ...props,
        children
      }
    ) }) });
  }
);
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = React.forwardRef(
  ({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground",
            className
          ),
          ref,
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-mobile": "true",
          className: "w-[var(--sidebar-width)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: [
            /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
              /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
              /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
          ]
        }
      ) });
    }
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: "group peer hidden text-sidebar-foreground md:block",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear",
                "group-data-[collapsible=offcanvas]:w-0",
                "group-data-[side=right]:rotate-180",
                variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex",
                side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                // Adjust the padding for floating and inset variants.
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  "data-sidebar": "sidebar",
                  className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                  children
                }
              )
            }
          )
        ]
      }
    );
  }
);
Sidebar.displayName = "Sidebar";
const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      ref,
      "data-sidebar": "trigger",
      variant: "ghost",
      size: "icon",
      className: cn("h-7 w-7", className),
      onClick: (event) => {
        onClick == null ? void 0 : onClick(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(PanelLeft, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      "data-sidebar": "rail",
      "aria-label": "Toggle Sidebar",
      tabIndex: -1,
      onClick: toggleSidebar,
      title: "Toggle Sidebar",
      className: cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      ),
      ...props
    }
  );
});
SidebarRail.displayName = "SidebarRail";
const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "main",
    {
      ref,
      className: cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      ),
      ...props
    }
  );
});
SidebarInset.displayName = "SidebarInset";
const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Input,
    {
      ref,
      "data-sidebar": "input",
      className: cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    Separator,
    {
      ref,
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
});
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
});
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-action",
      className: cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "group-content",
    className: cn("w-full text-sm", className),
    ...props
  }
));
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn("flex w-full min-w-0 flex-col gap-1", className),
    ...props
  }
));
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "li",
  {
    ref,
    "data-sidebar": "menu-item",
    className: cn("group/menu-item relative", className),
    ...props
  }
));
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const SidebarMenuButton = React.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        ...props
      }
    );
    if (!tooltip) {
      return button;
    }
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip
      };
    }
    return /* @__PURE__ */ jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsx(
        TooltipContent,
        {
          side: "right",
          align: "center",
          hidden: state !== "collapsed" || isMobile,
          ...tooltip
        }
      )
    ] });
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = React.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-action",
      className: cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = React.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "size-4 rounded-md",
            "data-sidebar": "menu-skeleton-icon"
          }
        ),
        /* @__PURE__ */ jsx(
          Skeleton,
          {
            className: "h-4 max-w-[--skeleton-width] flex-1",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    }
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "ul",
  {
    ref,
    "data-sidebar": "menu-sub",
    className: cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("li", { ref, ...props }));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = React.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
const CollapsibleContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  CollapsiblePrimitive.Content,
  {
    ref,
    className: cn(
      "overflow-hidden transition-all duration-300",
      "data-[state=open]:animate-[collapsible-down_300ms_ease-in-out]",
      "data-[state=closed]:animate-[collapsible-up_300ms_ease-in-out]",
      className
    ),
    ...props,
    children
  }
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;
function NavLinks({
  title,
  className,
  items
}) {
  const { openMenu, setOpenMenu } = useSidebar();
  return /* @__PURE__ */ jsxs(SidebarGroup, { className, children: [
    title && /* @__PURE__ */ jsx(SidebarGroupLabel, { children: title }),
    /* @__PURE__ */ jsx(SidebarMenu, { children: items.map((item) => {
      var _a;
      const isOpen = openMenu === item.title;
      return /* @__PURE__ */ jsx(
        Collapsible,
        {
          open: isOpen,
          onOpenChange: (open) => setOpenMenu(open ? item.title : null),
          asChild: true,
          children: /* @__PURE__ */ jsxs(SidebarMenuItem, { children: [
            /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, tooltip: item.title, children: /* @__PURE__ */ jsxs("a", { href: item.url, children: [
              /* @__PURE__ */ jsx(item.icon, {}),
              /* @__PURE__ */ jsx("span", { children: item.title })
            ] }) }),
            ((_a = item.items) == null ? void 0 : _a.length) ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(SidebarMenuAction, { className: "data-[state=open]:rotate-90", children: [
                /* @__PURE__ */ jsx(ChevronRight, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle" })
              ] }) }),
              /* @__PURE__ */ jsx(CollapsibleContent, { children: /* @__PURE__ */ jsx(SidebarMenuSub, { children: item.items.map((subItem) => /* @__PURE__ */ jsx(SidebarMenuSubItem, { children: /* @__PURE__ */ jsx(SidebarMenuSubButton, { asChild: true, children: /* @__PURE__ */ jsx("a", { href: subItem.url, children: /* @__PURE__ */ jsx("span", { children: subItem.title }) }) }) }, subItem.title)) }) })
            ] }) : null
          ] })
        },
        item.title
      );
    }) })
  ] });
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
function NavUser({
  user
}) {
  const { isMobile } = useSidebar();
  return /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(
    SidebarMenuButton,
    {
      size: "lg",
      className: "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
      children: [
        /* @__PURE__ */ jsx(Avatar, { className: "h-8 w-8 rounded-lg", children: user.avatar ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: user.avatar, alt: user.name }),
          /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg", children: "CN" })
        ] }) : /* @__PURE__ */ jsx(AvatarFallback, { className: "rounded-lg", children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid flex-1 text-left text-sm leading-tight", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate font-semibold", children: user.name }),
          /* @__PURE__ */ jsx("span", { className: "truncate text-xs", children: user.email })
        ] })
      ]
    }
  ) }) });
}
const data = {
  navigation: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true
    },
    {
      title: "Projects",
      url: "#",
      icon: Folder,
      items: [
        {
          title: "Project 1",
          url: "#"
        },
        {
          title: "Project 2",
          url: "#"
        },
        {
          title: "Project 3",
          url: "#"
        }
      ]
    },
    {
      title: "Docker",
      url: route("errors", { any: "docker" }),
      icon: Container,
      items: [
        {
          title: "Containers",
          url: "/admin/docker/containers"
        },
        {
          title: "Volumes",
          url: "#"
        },
        {
          title: "Networks",
          url: "#"
        },
        {
          title: "Images",
          url: "#"
        }
      ]
    },
    {
      title: "Network & Security",
      url: "#",
      icon: Network,
      items: [
        {
          title: "Activity",
          url: "#"
        },
        {
          title: "SSH Keys",
          url: "#"
        },
        {
          title: "Traefik",
          url: "#"
        },
        {
          title: "Firewall",
          url: "#"
        }
      ]
    },
    {
      title: "Storage",
      url: "#",
      icon: Archive,
      items: [
        {
          title: "Disk Usage",
          url: "#"
        },
        {
          title: "Backups",
          url: "#"
        }
      ]
    },
    {
      title: "Monitoring",
      url: "#",
      icon: SquareActivity,
      items: [
        {
          title: "Processes",
          url: "#"
        },
        {
          title: "Resources",
          url: "#"
        },
        {
          title: "Containers",
          url: "#"
        },
        {
          title: "Logs",
          url: "#"
        }
      ]
    }
  ],
  footer: [
    {
      title: "Terminal",
      url: "/admin/terminal",
      icon: SquareTerminal
    },
    {
      title: "Account",
      url: "/admin/account",
      icon: User
    },
    {
      title: "Log out",
      url: "/auth/login",
      icon: LogOut
    }
  ],
  user: {
    name: "Hakim Fidjel",
    email: "m@example.com"
  }
};
function AppSidebar({ ...props }) {
  const [openMenu, setOpenMenu] = React.useState(null);
  return /* @__PURE__ */ jsxs(Sidebar, { collapsible: "icon", ...props, children: [
    /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(
      SidebarMenuButton,
      {
        asChild: true,
        className: "data-[slot=sidebar-menu-button]:!p-1.5",
        children: /* @__PURE__ */ jsxs("a", { href: "#", children: [
          /* @__PURE__ */ jsx(ArrowUpCircleIcon, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsx("span", { className: "text-base font-semibold", children: "Acme Inc." })
        ] })
      }
    ) }) }) }),
    /* @__PURE__ */ jsxs(SidebarContent, { children: [
      /* @__PURE__ */ jsx(NavLinks, { title: "Navigation", items: data.navigation, openMenu, setOpenMenu }),
      /* @__PURE__ */ jsx(NavLinks, { title: "Quick access", items: data.footer, openMenu, setOpenMenu })
    ] }),
    /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsx(NavUser, { user: data.user }) })
  ] });
}
function Breadcrumb({ ...props }) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "breadcrumb", "data-slot": "breadcrumb", ...props });
}
function BreadcrumbList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      ),
      ...props
    }
  );
}
function BreadcrumbItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "breadcrumb-item",
      className: cn("inline-flex items-center gap-1.5", className),
      ...props
    }
  );
}
function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "breadcrumb-link",
      className: cn("hover:text-foreground transition-colors", className),
      ...props
    }
  );
}
function BreadcrumbPage({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("text-foreground font-normal", className),
      ...props
    }
  );
}
function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("[&>svg]:size-3.5", className),
      ...props,
      children: children ?? /* @__PURE__ */ jsx(ChevronRight, {})
    }
  );
}
function Breadcrumbs({ breadcrumbs: breadcrumbs2 }) {
  return /* @__PURE__ */ jsx(Fragment, { children: breadcrumbs2.length > 0 && /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsx(BreadcrumbList, { children: breadcrumbs2.map((item, index) => {
    const isLast = index === breadcrumbs2.length - 1;
    return /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: isLast ? /* @__PURE__ */ jsx(BreadcrumbPage, { children: item.title }) : /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { href: item.href, children: item.title }) }) }),
      !isLast && /* @__PURE__ */ jsx(BreadcrumbSeparator, {})
    ] }, index);
  }) }) }) });
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
const prefersDark = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
const setCookie = (name, value, days = 365) => {
  if (typeof document === "undefined") {
    return;
  }
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};
const applyTheme = (appearance) => {
  const isDark = appearance === "dark" || appearance === "system" && prefersDark();
  document.documentElement.classList.toggle("dark", isDark);
};
const mediaQuery = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.matchMedia("(prefers-color-scheme: dark)");
};
const handleSystemThemeChange = () => {
  const currentAppearance = localStorage.getItem("appearance");
  applyTheme(currentAppearance || "system");
};
function useAppearance() {
  const [appearance, setAppearance] = useState("system");
  const updateAppearance = useCallback((mode) => {
    setAppearance(mode);
    localStorage.setItem("appearance", mode);
    setCookie("appearance", mode);
    applyTheme(mode);
  }, []);
  useEffect(() => {
    const savedAppearance = localStorage.getItem("appearance");
    updateAppearance(savedAppearance || "system");
    return () => {
      var _a;
      return (_a = mediaQuery()) == null ? void 0 : _a.removeEventListener("change", handleSystemThemeChange);
    };
  }, [updateAppearance]);
  return { appearance, updateAppearance };
}
function AppearanceToggleDropdown({ className = "", ...props }) {
  const { appearance, updateAppearance } = useAppearance();
  const getCurrentIcon = () => {
    switch (appearance) {
      case "dark":
        return /* @__PURE__ */ jsx(Moon, { className: "h-5 w-5" });
      case "light":
        return /* @__PURE__ */ jsx(Sun, { className: "h-5 w-5" });
      default:
        return /* @__PURE__ */ jsx(Monitor, { className: "h-5 w-5" });
    }
  };
  return /* @__PURE__ */ jsx("div", { className, ...props, children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 rounded-md", children: [
      getCurrentIcon(),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle theme" })
    ] }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", children: [
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => updateAppearance("light"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Sun, { className: "h-5 w-5" }),
        "Light"
      ] }) }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => updateAppearance("dark"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Moon, { className: "h-5 w-5" }),
        "Dark"
      ] }) }),
      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => updateAppearance("system"), children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Monitor, { className: "h-5 w-5" }),
        "System"
      ] }) })
    ] })
  ] }) });
}
function AppHeader({ breadcrumbs: breadcrumbs2 = [] }) {
  return /* @__PURE__ */ jsxs("header", { className: "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6", children: [
      /* @__PURE__ */ jsx(SidebarTrigger, { className: "-ml-1" }),
      /* @__PURE__ */ jsx(
        Separator,
        {
          orientation: "vertical",
          className: "mx-2 data-[orientation=vertical]:h-4"
        }
      ),
      breadcrumbs2.length > 0 && /* @__PURE__ */ jsx("div", { className: "border-sidebar-border/70 flex w-full border-b", children: /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl", children: /* @__PURE__ */ jsx(Breadcrumbs, { breadcrumbs: breadcrumbs2 }) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 px-4 lg:gap-2 lg:px-6", children: /* @__PURE__ */ jsx(AppearanceToggleDropdown, {}) })
  ] });
}
function AdminLayout({
  children,
  breadcrumbs: breadcrumbs2 = []
}) {
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsx(AppSidebar, { variant: "floating" }),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsx(AppHeader, { breadcrumbs: breadcrumbs2 }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-1 flex-col", children: /* @__PURE__ */ jsx("div", { className: "@container/main flex flex-1 flex-col gap-2 relative py-6", children }) })
    ] })
  ] });
}
const breadcrumbs = [
  {
    title: "Dashboard",
    href: "/dashboard"
  }
];
function Page() {
  return /* @__PURE__ */ jsxs(AdminLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsx(PlaceholderPattern, { className: "absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20", statusCode: 501 })
  ] });
}
export {
  Page as default
};
