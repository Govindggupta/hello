import { getUserProfile } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrganizationCard } from "@/components/organization-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const userProfile = await getUserProfile()

  if (!userProfile) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile.first_name} {userProfile.last_name}
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile.organization_memberships.length === 0 ? (
                <p className="text-muted-foreground">You are not a member of any organizations yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userProfile.organization_memberships.map((membership) => (
                    <OrganizationCard key={membership.id} membership={membership} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
