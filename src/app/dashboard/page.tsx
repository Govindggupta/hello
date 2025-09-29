import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import { getOrganizations } from '@/lib/actions'

async function getUserOrganizations() {
  const user = await getUser()
  
  if (!user) {
    return []
  }
  
  const result = await getOrganizations()
  
  if (result.error || !result.organizations) {
    console.error('Error fetching user organizations:', result.error)
    return []
  }
  
  // Filter organizations by owner_id
  return result.organizations.filter(org => org.owner_id === user.id)
}

export default async function DashboardPage() {
  const organizations = await getUserOrganizations()
  const user = await getUser()
  
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-deep-slate">
          Welcome back, {user?.name || user?.contact_email || 'User'}!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Organization</CardTitle>
            <CardDescription>
              Register a new organization to start creating blue carbon projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/organization/new">
              <Button intent="primary">Create Organization</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Organizations</CardTitle>
            <CardDescription>
              View and manage your organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You have {organizations.length} organization{organizations.length !== 1 ? 's' : ''}
            </p>
            <Link href="/dashboard/organizations">
              <Button intent="outline">View Organizations</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Organizations</CardTitle>
          <CardDescription>
            Organizations you own or are a member of
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organizations.length === 0 ? (
            <p className="text-deep-slate">You don't have any organizations yet.</p>
          ) : (
            <div className="space-y-4">
              {organizations.map((org) => (
                <div key={org.id} className="border border-light-gray rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{org.name}</h3>
                      <p className="text-sm text-deep-slate">{org.description || 'No description'}</p>
                      <Link href={`/dashboard/organization/${org.id}`} className="text-ocean-blue text-sm hover:underline mt-2 inline-block">
                        View Details →
                      </Link>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      org.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : org.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}