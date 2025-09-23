import { getOrganizationById, getOrganizationMembers } from "@/lib/organizations"
import { requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleBadge } from "@/components/role-badge"
import { notFound } from "next/navigation"

interface OrganizationPageProps {
  params: Promise<{ id: string }>
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  await requireAuth()
  const { id } = await params

  const [organization, members] = await Promise.all([getOrganizationById(id), getOrganizationMembers(id)])

  if (!organization) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{organization.name}</h1>
          {organization.tenant && <p className="text-muted-foreground">Part of {organization.tenant.name}</p>}
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {member.profile?.first_name} {member.profile?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{member.profile?.email}</p>
                    </div>
                    <RoleBadge role={member.role} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
