"use client"

import { useState, useCallback } from "react"

export type FilterType = "all" | "pages" | "projects"

interface SearchResult {
  id: string
  title: string
  url: string
  type: "page" | "project"
}

export function useSearch() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // This function will be used for API calls in the future
  const performSearch = useCallback(async (searchQuery: string, searchFilter: FilterType) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call with timeout
      // Replace this with actual API call in the future
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Example results - replace with actual API response
      const mockResults: SearchResult[] = [
        { id: "1", title: "Dashboard", url: "/dashboard", type: "page" },
        { id: "2", title: "Settings", url: "/settings", type: "page" },
        { id: "3", title: "Profile", url: "/profile", type: "page" },
        { id: "4", title: "Website Redesign", url: "/projects/website", type: "project" },
        { id: "5", title: "Mobile App", url: "/projects/mobile-app", type: "project" },
        { id: "6", title: "Marketing Campaign", url: "/projects/marketing", type: "project" },
      ]

      // Filter results based on query and filter
      const filtered = mockResults.filter((result) => {
        const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
          searchFilter === "all" ||
          (searchFilter === "pages" && result.type === "page") ||
          (searchFilter === "projects" && result.type === "project")

        return matchesQuery && matchesFilter
      })

      setResults(filtered)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    query,
    setQuery,
    filter,
    setFilter,
    results,
    isLoading,
    search: performSearch,
  }
}

