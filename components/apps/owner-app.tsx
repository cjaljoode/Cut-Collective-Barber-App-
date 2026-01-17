"use client"

import { LayoutDashboard, TrendingUp, Users, Settings, DollarSign, BarChart3, Store } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface OwnerAppProps {
  children: React.ReactNode
}

const ownerNav = [
  { name: "Dashboard", href: "/owner", icon: LayoutDashboard },
  { name: "Analytics", href: "/owner/analytics", icon: BarChart3 },
  { name: "Employees", href: "/owner/employees", icon: Users },
  { name: "Revenue", href: "/owner/revenue", icon: DollarSign },
  { name: "Shop Settings", href: "/owner/settings", icon: Store },
  { name: "Settings", href: "/owner/settings", icon: Settings },
]

export function OwnerApp({ children }: OwnerAppProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Store className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Shop Management</h1>
                <p className="text-xs text-muted-foreground">Elite Cuts Barbershop</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="px-3 py-1.5 rounded-md bg-primary/10 text-primary font-medium">
                  Today: $1,247
                </div>
                <div className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground">
                  12 Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 md:pb-0 border-r border-border bg-card overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {ownerNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="container mx-auto px-4 py-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

