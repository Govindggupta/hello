import { getUserProfile } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const userProfile = await getUserProfile()

  if (!userProfile) {
    redirect("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg">
                    {userProfile.first_name} {userProfile.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{userProfile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member since</label>
                  <p className="text-lg">
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization Memberships</CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile.organization_memberships.length === 0 ? (
                <p className="text-muted-foreground">You are not a member of any organizations yet.</p>
              ) : (
                <div className="space-y-4">
                  {userProfile.organization_memberships.map((membership) => (
                    <div key={membership.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{membership.organization?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {membership.organization?.tenant?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{membership.role}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(membership.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
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
