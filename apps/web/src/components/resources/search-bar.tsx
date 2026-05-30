"use client"

import { Search } from "lucide-react"
import { Input } from "@darasa-lako/ui/components/input"

export function SearchBar() {
  return (
    <div className="relative mx-auto w-106">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search all resources..."
        className="w-full pl-12 pr-4 py-6 text-base bg-input border-border rounded-xl shadow-sm focus-visible:ring-primary"
      />
    </div>
  )
}