import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserRoleProvider } from "@/components/providers/role-provider"
import { TenantProvider } from "@/components/providers/tenant-provider"
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Cut Collective - Barber Management & Community Platform",
  description: "Find barbers, book appointments, and connect with the cutting community",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <TenantProvider>
          <UserRoleProvider>
            <AppLayoutWrapper>{children}</AppLayoutWrapper>
          </UserRoleProvider>
        </TenantProvider>
      </body>
    </html>
  )
}

