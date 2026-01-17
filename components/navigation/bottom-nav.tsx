"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  MessageSquare,
  Scissors,
  TrendingUp,
  Users,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserRole } from "@/lib/supabase"

interface BottomNavProps {
  role: UserRole
}

const navigationItems = {
  client: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Discover", href: "/discover", icon: Search },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Feed", href: "/feed", icon: MessageSquare },
  ],
  barber: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Portfolio", href: "/portfolio", icon: Scissors },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Earnings", href: "/earnings", icon: TrendingUp },
  ],
  owner: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname()
  const items = navigationItems[role] || []

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card z-50">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

