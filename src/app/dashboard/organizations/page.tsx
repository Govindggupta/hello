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

export default async function OrganizationsPage() {
  const organizations = await getUserOrganizations()
  const user = await getUser()
  
  return (
    <div className="py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-ocean-blue hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold mt-2">Your Organizations</h1>
          <p className="text-deep-slate">
            Manage your organizations and their projects
          </p>
        </div>
        
        <Link href="/dashboard/organization/new">
          <Button intent="primary">Create Organization</Button>
        </Link>
      </div>
      
      {organizations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No organizations yet</h3>
            <p className="text-deep-slate mb-4">
              You haven't created any organizations yet. Create your first organization to start managing blue carbon projects.
            </p>
            <Link href="/dashboard/organization/new">
              <Button intent="primary">Create Your First Organization</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card key={org.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{org.name}</CardTitle>
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
                <CardDescription>
                  Created on {new Date(org.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-deep-slate mb-4 flex-1">
                  {org.description || 'No description provided'}
                </p>
                <div className="flex gap-2">
                  <Link href={`/dashboard/organization/${org.id}`} className="flex-1">
                    <Button intent="outline" className="w-full">View Details</Button>
                  </Link>
                  {org.status === 'approved' && (
                    <Link href={`/dashboard/projects/new?org_id=${org.id}`} className="flex-1">
                      <Button intent="primary" className="w-full">Create Project</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}