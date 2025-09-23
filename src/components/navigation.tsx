"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { OrganizationSelector } from "./organization-selector"
import { RoleBadge } from "./role-badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { UserWithMemberships, UserRole } from "@/lib/types"

export function Navigation() {
  const [user, setUser] = useState<UserWithMemberships | null>(null)
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(`
          *,
          organization_memberships (
            *,
            organization:organizations (
              *,
              tenant:tenants (*)
            )
          )
        `)
        .eq("id", authUser.id)
        .single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return
      }

      setUser(profile as UserWithMemberships)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (selectedOrgId && user) {
      const membership = user.organization_memberships.find((m) => m.organization_id === selectedOrgId)
      setUserRole((membership?.role as UserRole) || null)
    }
  }, [selectedOrgId, user])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (!user) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="animate-pulse bg-muted h-8 w-32 rounded" />
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold">
            Multi-Tenant App
          </Link>
          <OrganizationSelector onOrganizationChange={setSelectedOrgId} selectedOrganizationId={selectedOrgId} />
          {userRole && <RoleBadge role={userRole} />}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {user.first_name} {user.last_name}
          </span>

          <Button asChild variant="ghost" size="sm">
            <Link href="/profile">Profile</Link>
          </Button>

          {selectedOrgId && userRole && (userRole === "admin" || userRole === "manager") && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/organizations/${selectedOrgId}/manage`}>Manage</Link>
            </Button>
          )}

          {selectedOrgId && userRole === "admin" && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/organizations/${selectedOrgId}/admin`}>Admin</Link>
            </Button>
          )}

          <Button onClick={handleSignOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
