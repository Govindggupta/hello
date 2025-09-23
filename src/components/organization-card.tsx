import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RoleBadge } from "./role-badge"
import { RoleGuard } from "./role-guard"
import Link from "next/link"
import type { OrganizationMembership } from "@/lib/types"

interface OrganizationCardProps {
  membership: OrganizationMembership
}

export function OrganizationCard({ membership }: OrganizationCardProps) {
  const { organization, role } = membership

  if (!organization) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{organization.name}</CardTitle>
          <RoleBadge role={role} />
        </div>
        {organization.tenant && <p className="text-sm text-muted-foreground">{organization.tenant.name}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href={`/organizations/${organization.id}`}>View</Link>
          </Button>

          <RoleGuard allowedRoles={["admin", "manager"]} organizationId={organization.id}>
            <Button asChild variant="outline" size="sm">
              <Link href={`/organizations/${organization.id}/manage`}>Manage</Link>
            </Button>
          </RoleGuard>

          <RoleGuard allowedRoles={["admin"]} organizationId={organization.id}>
            <Button asChild variant="outline" size="sm">
              <Link href={`/organizations/${organization.id}/admin`}>Admin</Link>
            </Button>
          </RoleGuard>
        </div>
      </CardContent>
    </Card>
  )
}
