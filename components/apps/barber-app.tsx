"use client"

import { LayoutDashboard, Scissors, Calendar, TrendingUp, Image as ImageIcon, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BarberAppProps {
  children: React.ReactNode
}

const barberNav = [
  { name: "Dashboard", href: "/barber", icon: LayoutDashboard },
  { name: "Schedule", href: "/barber/schedule", icon: Calendar },
  { name: "Portfolio", href: "/barber/portfolio", icon: Scissors },
  { name: "Gallery", href: "/barber/gallery", icon: ImageIcon },
  { name: "Earnings", href: "/barber/earnings", icon: TrendingUp },
  { name: "Settings", href: "/barber/settings", icon: Settings },
]

export function BarberApp({ children }: BarberAppProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 border-r border-border bg-card">
        <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Scissors className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-foreground">Barber Studio</h1>
              <p className="text-xs text-muted-foreground">Professional Tools</p>
            </div>
          </div>
          <nav className="mt-5 flex-1 px-3 space-y-1">
            {barberNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="px-6 pt-4 border-t border-border">
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">Today's Earnings</p>
              <p className="text-2xl font-bold text-primary">$247</p>
              <p className="text-xs text-muted-foreground mt-1">3 appointments completed</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="container mx-auto px-4 py-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile/Tablet) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card z-50">
        <div className="flex justify-around items-center h-16">
          {barberNav.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="lg:hidden h-16" /> {/* Spacer for mobile nav */}
    </div>
  )
}

