"use client"

import { useUserRole } from "@/components/providers/role-provider"
import { UserRole } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function RoleSwitcher() {
  const { role, setRole } = useUserRole()
  const router = useRouter()

  const switchRole = (newRole: UserRole) => {
    setRole(newRole)
    localStorage.setItem("userRole", newRole)
    
    // Navigate to appropriate app
    switch (newRole) {
      case "client":
        router.push("/customer")
        break
      case "barber":
        router.push("/barber")
        break
      case "owner":
        router.push("/owner")
        break
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-2 bg-card border border-border rounded-lg shadow-lg">
      <p className="text-xs text-muted-foreground mb-1 px-2">Switch Role (Dev)</p>
      <div className="flex flex-col gap-1">
        <Button
          size="sm"
          variant={role === "client" ? "default" : "outline"}
          onClick={() => switchRole("client")}
          className="text-xs"
        >
          Customer
        </Button>
        <Button
          size="sm"
          variant={role === "barber" ? "default" : "outline"}
          onClick={() => switchRole("barber")}
          className="text-xs"
        >
          Barber
        </Button>
        <Button
          size="sm"
          variant={role === "owner" ? "default" : "outline"}
          onClick={() => switchRole("owner")}
          className="text-xs"
        >
          Owner
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/pos")}
          className="text-xs"
        >
          POS
        </Button>
      </div>
    </div>
  )
}

