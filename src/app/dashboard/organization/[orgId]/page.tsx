import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { getOrganization, getProjects } from '@/lib/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function getOrganizationWithAuth(orgId: string) {
  const user = await getUser()
  
  if (!user) {
    return null
  }
  
  const result = await getOrganization(orgId)
  
  if (result.error || !result.organization) {
    console.error('Error fetching organization:', result.error)
    return null
  }
  
  // Check if user owns the organization
  if (result.organization.owner_id !== user.id) {
    return null
  }
  
  return result.organization
}

async function getOrganizationProjects(orgId: string) {
  const result = await getProjects()
  
  if (result.error || !result.projects) {
    console.error('Error fetching organization projects:', result.error)
    return []
  }
  
  // Filter projects by organization_id
  return result.projects.filter(project => project.organization_id === orgId)
}

export default async function OrganizationPage({
  params,
}: {
  params: { orgId: string }
}) {
  const organization = await getOrganizationWithAuth(params.orgId)
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  if (!organization) {
    notFound()
  }
  
  const projects = await getOrganizationProjects(params.orgId)
  
  return (
    <div className="py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-ocean-blue hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold mt-2">{organization.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded ${
              organization.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : organization.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
            </span>
            <span className="text-sm text-deep-slate">
              Created on {new Date(organization.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {organization.status === 'approved' && (
          <Link href={`/dashboard/projects/new?org_id=${organization.id}`}>
            <Button intent="primary">Create New Project</Button>
          </Link>
        )}
      </div>
      
      {organization.description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{organization.description}</p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            Carbon restoration projects managed by this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-deep-slate mb-4">
                {organization.status === 'approved' 
                  ? "You haven't created any projects yet."
                  : "Your organization needs to be approved before creating projects."}
              </p>
              {organization.status === 'approved' && (
                <Link href={`/dashboard/projects/new?org_id=${organization.id}`}>
                  <Button intent="primary">Create Your First Project</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-light-gray rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-deep-slate">{project.description || 'No description'}</p>
                      <p className="text-sm text-deep-slate mt-1">
                        <strong>Location:</strong> {project.location_text}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : project.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
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