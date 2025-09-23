"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { UserRole } from "@/lib/types"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  organizationId: string
}

export function RoleGuard({ children, allowedRoles, organizationId }: RoleGuardProps) {
  const [hasPermission, setHasPermission] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPermission() {
      const supabase = createClient()
      
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (!user) {
        setHasPermission(false)
        setIsLoading(false)
        return
      }

      const { data: membership, error } = await supabase
        .from("organization_memberships")
        .select("role")
        .eq("user_id", user.id)
        .eq("organization_id", organizationId)
        .single()

      if (error || !membership) {
        setHasPermission(false)
      } else {
        setHasPermission(allowedRoles.includes(membership.role))
      }
      
      setIsLoading(false)
    }

    checkPermission()
  }, [organizationId, allowedRoles])

  if (isLoading) {
    return null
  }

  if (!hasPermission) {
    return null
  }

  return <>{children}</>
}
