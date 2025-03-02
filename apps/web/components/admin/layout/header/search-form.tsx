"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { CommandSearch } from "@/components/admin/layout/header/command-search"
import { useSearch } from "@/lib/layout/useSearch"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const [open, setOpen] = useState(false)
  const { query, setQuery, filter, setFilter } = useSearch()

  // Close the command palette when pressing escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <form {...props} onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Type to search... (⌘K)"
            className="h-8 pl-7 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setOpen(true)}
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </div>
      </form>
      <CommandSearch
        open={open}
        setOpen={setOpen}
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
      />
    </>
  )
}

