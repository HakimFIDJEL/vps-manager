"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { Loader } from "@/components/elements/loader"

interface LoaderContextType {
  showLoader: () => void
  hideLoader: () => void
  isLoading: boolean
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined)

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)

  const showLoader = () => setIsLoading(true)
  const hideLoader = () => setIsLoading(false)

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      <Loader isVisible={isLoading} />
      {children}
    </LoaderContext.Provider>
  )
}

export function useLoader() {
  const context = useContext(LoaderContext)

  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }

  return context
}

