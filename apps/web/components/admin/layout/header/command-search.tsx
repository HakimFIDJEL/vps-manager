"use client"

import { useEffect } from "react"
import { FileText, Folder, Loader2 } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command"
import { Badge } from "@workspace/ui/components/badge"
import type { FilterType } from "@/lib/layout/useSearch"

interface CommandSearchProps {
  open: boolean
  setOpen: (open: boolean) => void
  query: string
  setQuery: (query: string) => void
  filter: FilterType
  setFilter: (filter: FilterType) => void
}

export function CommandSearch({ open, setOpen, query, setQuery, filter, setFilter }: CommandSearchProps) {
  // Sync the input value with the search query
  useEffect(() => {
    if (!open) {
      return
    }
  }, [open])

  // Example data - replace with actual data from your API
  const pages = [
    { id: "1", title: "Dashboard", url: "/dashboard" },
    { id: "2", title: "Settings", url: "/settings" },
    { id: "3", title: "Profile", url: "/profile" },
  ]

  const projects = [
    { id: "1", title: "Website Redesign", url: "/projects/website" },
    { id: "2", title: "Mobile App", url: "/projects/mobile-app" },
    { id: "3", title: "Marketing Campaign", url: "/projects/marketing" },
  ]

  // Filter results based on query and selected filter
  const filteredPages = pages.filter((page) => page.title.toLowerCase().includes(query.toLowerCase()))

  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(query.toLowerCase()))

  // Determine if we should show loading state (for future API integration)
  const isLoading = false

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type to search..." value={query} onValueChange={setQuery} />
      <CommandList>
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && query.length > 0 && !filteredPages.length && !filteredProjects.length && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}

        <div className="flex items-center px-3 pt-3">
          <div className="space-x-2">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={filter === "pages" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("pages")}
            >
              Pages
            </Badge>
            <Badge
              variant={filter === "projects" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("projects")}
            >
              Projects
            </Badge>
          </div>
        </div>

        {(filter === "all" || filter === "pages") && filteredPages.length > 0 && (
          <CommandGroup heading="Pages">
            {filteredPages.map((page) => (
              <CommandItem
                key={page.id}
                onSelect={() => {
                  // Navigate to the page
                  window.location.href = page.url
                  setOpen(false)
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                {page.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {(filter === "all" || filter === "projects") && filteredProjects.length > 0 && (
          <>
            {filter === "all" && filteredPages.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Projects">
              {filteredProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => {
                    // Navigate to the project
                    window.location.href = project.url
                    setOpen(false)
                  }}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {project.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

