import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "./auth"
import type { Organization, OrganizationMembership, UserRole } from "./types"

export async function getUserOrganizations(): Promise<Organization[]> {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) return []

  const { data: organizations, error } = await supabase.from("organizations").select(`
      *,
      tenant:tenants (*)
    `)

  if (error) {
    console.error("Error fetching organizations:", error)
    return []
  }

  return organizations as Organization[]
}

export async function getOrganizationById(id: string): Promise<Organization | null> {
  const supabase = await createClient()

  const { data: organization, error } = await supabase
    .from("organizations")
    .select(`
      *,
      tenant:tenants (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching organization:", error)
    return null
  }

  return organization as Organization
}

export async function getOrganizationMembers(organizationId: string): Promise<OrganizationMembership[]> {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from("organization_memberships")
    .select(`
      *,
      profile:profiles (*)
    `)
    .eq("organization_id", organizationId)

  if (error) {
    console.error("Error fetching organization members:", error)
    return []
  }

  return members as OrganizationMembership[]
}

export async function addUserToOrganization(
  userId: string,
  organizationId: string,
  role: UserRole = "employee",
): Promise<OrganizationMembership | null> {
  const supabase = await createClient()

  const { data: membership, error } = await supabase
    .from("organization_memberships")
    .insert({
      user_id: userId,
      organization_id: organizationId,
      role,
    })
    .select(`
      *,
      profile:profiles (*),
      organization:organizations (*)
    `)
    .single()

  if (error) {
    console.error("Error adding user to organization:", error)
    return null
  }

  return membership as OrganizationMembership
}

export async function updateUserRole(membershipId: string, newRole: UserRole): Promise<OrganizationMembership | null> {
  const supabase = await createClient()

  const { data: membership, error } = await supabase
    .from("organization_memberships")
    .update({ role: newRole })
    .eq("id", membershipId)
    .select(`
      *,
      profile:profiles (*),
      organization:organizations (*)
    `)
    .single()

  if (error) {
    console.error("Error updating user role:", error)
    return null
  }

  return membership as OrganizationMembership
}

export async function removeUserFromOrganization(membershipId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from("organization_memberships").delete().eq("id", membershipId)

  if (error) {
    console.error("Error removing user from organization:", error)
    return false
  }

  return true
}

export async function createOrganization(tenantId: string, name: string, slug: string): Promise<Organization | null> {
  const supabase = await createClient()

  const { data: organization, error } = await supabase
    .from("organizations")
    .insert({
      tenant_id: tenantId,
      name,
      slug,
    })
    .select(`
      *,
      tenant:tenants (*)
    `)
    .single()

  if (error) {
    console.error("Error creating organization:", error)
    return null
  }

  return organization as Organization
}
