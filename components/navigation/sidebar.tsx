"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  Users, 
  Settings,
  Home,
  Scissors,
  TrendingUp,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserRole } from "@/lib/supabase"

interface SidebarProps {
  role: UserRole
}

const navigationItems = {
  client: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Discover Shops", href: "/discover", icon: Search },
    { name: "My Appointments", href: "/appointments", icon: Calendar },
    { name: "Community Feed", href: "/feed", icon: MessageSquare },
  ],
  barber: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Portfolio", href: "/portfolio", icon: Scissors },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Work Gallery", href: "/gallery", icon: Home },
    { name: "Earnings", href: "/earnings", icon: TrendingUp },
  ],
  owner: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const items = navigationItems[role] || []

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 border-r border-border bg-card">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <Scissors className="h-8 w-8 text-primary" />
          <h1 className="ml-2 text-2xl font-bold text-foreground">
            Cut Collective
          </h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

