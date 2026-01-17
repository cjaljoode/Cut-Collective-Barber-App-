"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { UserRole, createSupabaseClient } from "@/lib/supabase"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  isLoading: boolean
}

const RoleContext = createContext<RoleContextType>({
  role: "client",
  setRole: () => {},
  isLoading: true,
})

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("client")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the user's role from Supabase
    // For now, we'll use localStorage or default to client
    const fetchUserRole = async () => {
      try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          // Fallback to localStorage if Supabase not configured
          const storedRole = localStorage.getItem("userRole") as UserRole
          if (storedRole && ["client", "barber", "owner"].includes(storedRole)) {
            setRole(storedRole)
          } else {
            setRole("client")
          }
          setIsLoading(false)
          return
        }

        const supabase = createSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Fetch user profile with role from database
          // This is a placeholder - you'll need to implement the actual query
          const storedRole = localStorage.getItem("userRole") as UserRole
          if (storedRole && ["client", "barber", "owner"].includes(storedRole)) {
            setRole(storedRole)
          }
        } else {
          setRole("client")
        }
      } catch (error) {
        console.error("Error fetching user role:", error)
        // Fallback to localStorage on error
        const storedRole = localStorage.getItem("userRole") as UserRole
        if (storedRole && ["client", "barber", "owner"].includes(storedRole)) {
          setRole(storedRole)
        } else {
          setRole("client")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useUserRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useUserRole must be used within UserRoleProvider")
  }
  return context
}

