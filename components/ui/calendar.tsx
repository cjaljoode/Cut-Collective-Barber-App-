"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CalendarProps {
  selected?: Date
  onSelect?: (date?: Date) => void
  className?: string
  minDate?: Date
}

export function Calendar({ selected, onSelect, className, minDate }: CalendarProps) {
  const value = selected ? selected.toISOString().split("T")[0] : ""
  const minValue = minDate ? minDate.toISOString().split("T")[0] : undefined

  return (
    <div className={cn("w-full", className)}>
      <input
        type="date"
        value={value}
        min={minValue}
        onChange={(event) => {
          const next = event.target.value ? new Date(event.target.value) : undefined
          onSelect?.(next)
        }}
        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-none"
      />
    </div>
  )
}
