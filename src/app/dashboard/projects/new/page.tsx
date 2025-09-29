import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { getOrganizations } from '@/lib/actions'
import { ProjectForm } from '@/components/forms/project-form'
import Link from 'next/link'

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
  
  // Filter organizations by owner_id and status
  return result.organizations.filter(org =>
    org.owner_id === user.id && org.status === 'approved'
  )
}

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const organizations = await getUserOrganizations()
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const organizationId = searchParams.org_id as string
  
  // If no organization ID is provided, show a list of organizations to choose from
  if (!organizationId) {
    if (organizations.length === 0) {
      return (
        <div className="py-8">
          <div className="mb-6">
            <Link href="/dashboard" className="text-ocean-blue hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-light-gray rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold mb-2">No Approved Organizations</h2>
              <p className="text-deep-slate mb-4">
                You need to have an approved organization before creating projects.
              </p>
              <Link href="/dashboard/organization/new">
                <button className="px-4 py-2 bg-ocean-blue text-white rounded hover:bg-ocean-blue-dark transition-colors">
                  Create Organization
                </button>
              </Link>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-ocean-blue hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-light-gray rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Select an Organization</h2>
            <p className="text-deep-slate mb-4">
              Choose an organization to create a project for:
            </p>
            
            <div className="space-y-3">
              {organizations.map((org) => (
                <Link
                  key={org.id}
                  href={`/dashboard/projects/new?org_id=${org.id}`}
                  className="block p-3 border border-light-gray rounded hover:bg-sea-salt transition-colors"
                >
                  <div className="font-medium">{org.name}</div>
                  <div className="text-sm text-deep-slate">{org.description || 'No description'}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Find the selected organization
  const organization = organizations.find(org => org.id === organizationId)
  
  if (!organization) {
    redirect('/dashboard/projects/new')
  }
  
  return (
    <div className="py-8">
      <div className="mb-6">
        <Link href={`/dashboard/organization/${organizationId}`} className="text-ocean-blue hover:underline">
          ← Back to Organization
        </Link>
      </div>
      
      <ProjectForm 
        organizationId={organizationId} 
        organizationName={organization.name} 
      />
    </div>
  )
}