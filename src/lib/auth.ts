import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { UserWithMemberships, OrganizationMembership } from "./types"

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    return null
  }

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function getUserProfile(): Promise<UserWithMemberships | null> {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) return null

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
    .eq("id", user.id)
    .single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return profile as UserWithMemberships
}

export async function getUserMemberships(): Promise<OrganizationMembership[]> {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) return []

  const { data: memberships, error } = await supabase
    .from("organization_memberships")
    .select(`
      *,
      organization:organizations (
        *,
        tenant:tenants (*)
      )
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching user memberships:", error)
    return []
  }

  return memberships as OrganizationMembership[]
}

export async function hasRole(organizationId: string, requiredRoles: string[]): Promise<boolean> {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) return false

  const { data: membership, error } = await supabase
    .from("organization_memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .single()

  if (error || !membership) return false

  return requiredRoles.includes(membership.role)
}

export async function requireRole(organizationId: string, requiredRoles: string[]) {
  const hasRequiredRole = await hasRole(organizationId, requiredRoles)
  if (!hasRequiredRole) {
    redirect("/unauthorized")
  }
}
