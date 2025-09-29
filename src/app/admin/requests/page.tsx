import { getOrganizations } from '@/lib/actions'
import { mockGetUser } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AdminActions } from '@/components/admin/admin-actions'
import Link from 'next/link'

async function getPendingOrganizations() {
  const result = await getOrganizations()
  
  if (result.error || !result.organizations) {
    console.error('Error fetching pending organizations:', result.error)
    return []
  }
  
  // Filter organizations by status and get owner information
  const pendingOrgs = result.organizations.filter(org => org.status === 'pending')
  
  // Get owner information for each organization
  const organizationsWithOwners = await Promise.all(
    pendingOrgs.map(async (org) => {
      const owner = await mockGetUser(org.owner_id)
      return {
        ...org,
        owner: owner ? {
          full_name: owner.name,
          email: owner.contact_email
        } : null
      }
    })
  )
  
  return organizationsWithOwners
}

export default async function AdminRequestsPage() {
  const pendingOrganizations = await getPendingOrganizations()
  
  return (
    <div className="py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Organization Requests</h1>
          <p className="text-deep-slate">Review and approve organization requests</p>
        </div>
        <Link href="/admin">
          <Button intent="outline">← Back to Admin</Button>
        </Link>
      </div>
      
      {pendingOrganizations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-deep-slate">No pending organization requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingOrganizations.map((org) => (
            <Card key={org.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{org.name}</span>
                  <span className="text-sm font-normal px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    Pending
                  </span>
                </CardTitle>
                <CardDescription>
                  {org.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-sm">
                  <p><strong>Owner:</strong> {org.owner?.full_name || 'Unknown'}</p>
                  <p><strong>Email:</strong> {org.owner?.email || 'Unknown'}</p>
                  <p><strong>Submitted:</strong> {new Date(org.created_at).toLocaleDateString()}</p>
                </div>
                
                <AdminActions orgId={org.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}