"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { LoaderProvider } from "@/providers/loader/provider"

export function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <LoaderProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </LoaderProvider>
    </NextThemesProvider>
  )
}
