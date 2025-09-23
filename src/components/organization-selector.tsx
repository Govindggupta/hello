"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OrganizationMembership } from "@/lib/types"

interface OrganizationSelectorProps {
  onOrganizationChange: (organizationId: string) => void
  selectedOrganizationId?: string
}

export function OrganizationSelector({ onOrganizationChange, selectedOrganizationId }: OrganizationSelectorProps) {
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMemberships() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: userMemberships, error } = await supabase
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
        console.error("Error fetching memberships:", error)
        return
      }

      setMemberships(userMemberships as OrganizationMembership[])
      setLoading(false)

      // Auto-select first organization if none selected
      if (!selectedOrganizationId && userMemberships.length > 0) {
        onOrganizationChange(userMemberships[0].organization_id)
      }
    }

    fetchMemberships()
  }, [onOrganizationChange, selectedOrganizationId])

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    )
  }

  if (memberships.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="No organizations" />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={selectedOrganizationId} onValueChange={onOrganizationChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        {memberships.map((membership) => (
          <SelectItem key={membership.organization_id} value={membership.organization_id}>
            <div className="flex flex-col">
              <span>{membership.organization?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{membership.role}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
