"use client"

import { useUserRole } from "@/components/providers/role-provider"
import { CustomerApp } from "@/components/apps/customer-app"
import { BarberApp } from "@/components/apps/barber-app"
import { OwnerApp } from "@/components/apps/owner-app"
import { POSApp } from "@/components/apps/pos-app"
import { RoleSwitcher } from "@/components/role-switcher"
import { usePathname } from "next/navigation"

interface AppRouterProps {
  children: React.ReactNode
}

export function AppRouter({ children }: AppRouterProps) {
  const { role, isLoading } = useUserRole()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Check if we're in POS mode
  if (pathname?.startsWith("/pos")) {
    return (
      <>
        <POSApp>{children}</POSApp>
        <RoleSwitcher />
      </>
    )
  }

  // Route to appropriate app based on path prefix
  if (pathname?.startsWith("/customer")) {
    return (
      <>
        <CustomerApp>{children}</CustomerApp>
        <RoleSwitcher />
      </>
    )
  }

  if (pathname?.startsWith("/barber")) {
    return (
      <>
        <BarberApp>{children}</BarberApp>
        <RoleSwitcher />
      </>
    )
  }

  if (pathname?.startsWith("/owner")) {
    return (
      <>
        <OwnerApp>{children}</OwnerApp>
        <RoleSwitcher />
      </>
    )
  }

  // Default routing based on role
  let AppComponent
  switch (role) {
    case "barber":
      AppComponent = BarberApp
      break
    case "owner":
      AppComponent = OwnerApp
      break
    case "client":
    default:
      AppComponent = CustomerApp
      break
  }

  return (
    <>
      <AppComponent>{children}</AppComponent>
      <RoleSwitcher />
    </>
  )
}

