"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { parseTenantFromHost } from "@/lib/tenant"

interface TenantContextValue {
  tenant: string | null
  isLoading: boolean
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  isLoading: true,
})

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const host = window.location.hostname
    const parsed = parseTenantFromHost(host)
    setTenant(parsed)
    setIsLoading(false)
  }, [])

  const value = useMemo(() => ({ tenant, isLoading }), [tenant, isLoading])

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider")
  }
  return context
}
