import type React from "react"
import { Navigation } from "./navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-6">{children}</main>
    </div>
  )
}
