export type UserRole = "admin" | "manager" | "employee"

export interface Tenant {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  tenant_id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  tenant?: Tenant
}

export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
}

export interface OrganizationMembership {
  id: string
  user_id: string
  organization_id: string
  role: UserRole
  created_at: string
  updated_at: string
  organization?: Organization
  profile?: Profile
}

export interface UserWithMemberships extends Profile {
  organization_memberships: OrganizationMembership[]
}
