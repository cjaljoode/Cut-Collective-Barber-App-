import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default"
          ? "bg-primary text-primary-foreground"
          : "border border-input text-foreground",
        className
      )}
      {...props}
    />
  )
}
