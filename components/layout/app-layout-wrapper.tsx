"use client"

import { AppRouter } from "@/components/layout/app-router"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AppRouter>{children}</AppRouter>
}

