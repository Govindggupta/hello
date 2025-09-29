import { getProjects, getOrganizations, getProjectProofs } from '@/lib/actions'
import { mockGetUser, mockGetOrganization } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProjectActions } from '@/components/admin/project-actions'
import { AdminProofActions } from '@/components/admin/admin-proof-actions'
import Link from 'next/link'

async function getPendingProjects() {
  const result = await getProjects()
  
  if (result.error || !result.projects) {
    console.error('Error fetching pending projects:', result.error)
    return []
  }
  
  // Filter projects by status
  const pendingProjects = result.projects.filter(project => project.status === 'pending')
  
  // Get organization and owner information for each project
  const projectsWithDetails = await Promise.all(
    pendingProjects.map(async (project) => {
      const organization = await mockGetOrganization(project.organization_id)
      const owner = await mockGetUser(organization?.owner_id || '')
      
      return {
        ...project,
        organization: organization ? { name: organization.name } : null,
        owner: owner ? {
          full_name: owner.name,
          email: owner.contact_email
        } : null
      }
    })
  )
  
  return projectsWithDetails
}

async function getApprovedProjectsWithProofs() {
  const projectsResult = await getProjects()
  
  if (projectsResult.error || !projectsResult.projects) {
    console.error('Error fetching approved projects:', projectsResult.error)
    return []
  }
  
  // Filter projects by status
  const approvedProjects = projectsResult.projects.filter(project =>
    project.status === 'approved' || project.status === 'verified'
  )
  
  // Get organization, owner, and proof information for each project
  const projectsWithDetails = await Promise.all(
    approvedProjects.map(async (project) => {
      const organization = await mockGetOrganization(project.organization_id)
      const owner = await mockGetUser(organization?.owner_id || '')
      const proofsResult = await getProjectProofs(project.id)
      
      return {
        ...project,
        organization: organization ? { name: organization.name } : null,
        owner: owner ? {
          full_name: owner.name,
          email: owner.contact_email
        } : null,
        proofs: proofsResult.success ? proofsResult.proofs : []
      }
    })
  )
  
  return projectsWithDetails
}

export default async function AdminProjectsPage() {
  const pendingProjects = await getPendingProjects()
  const approvedProjects = await getApprovedProjectsWithProofs()
  
  return (
    <div className="py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Project Management</h1>
          <p className="text-deep-slate">Review projects and verify uploaded proofs</p>
        </div>
        <Link href="/admin">
          <Button intent="outline">← Back to Admin</Button>
        </Link>
      </div>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Pending Approval ({pendingProjects.length})</h2>
        
        {pendingProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-deep-slate">No pending project requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{project.name}</span>
                    <span className="text-sm font-normal px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Pending
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {project.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-sm">
                    <p><strong>Organization:</strong> {project.organization?.name || 'Unknown'}</p>
                    <p><strong>Owner:</strong> {project.owner?.full_name || 'Unknown'}</p>
                    <p><strong>Email:</strong> {project.owner?.email || 'Unknown'}</p>
                    <p><strong>Location:</strong> {project.location_text}</p>
                    <p><strong>Submitted:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <ProjectActions projectId={project.id} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Projects with Proofs ({approvedProjects.length})</h2>
        
        {approvedProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-deep-slate">No projects with proofs to verify.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{project.name}</span>
                    <span className={`text-sm font-normal px-2 py-1 rounded ${
                      project.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : project.status === 'verified'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {project.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-sm">
                    <p><strong>Organization:</strong> {project.organization?.name || 'Unknown'}</p>
                    <p><strong>Owner:</strong> {project.owner?.full_name || 'Unknown'}</p>
                    <p><strong>Email:</strong> {project.owner?.email || 'Unknown'}</p>
                    <p><strong>Location:</strong> {project.location_text}</p>
                    <p><strong>Submitted:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-sm mb-2">Project Proofs ({project.proofs?.length || 0})</h3>
                    
                    {project.proofs && project.proofs.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {project.proofs.map((proof: any) => (
                          <div key={proof.id} className="border border-light-gray rounded-lg overflow-hidden">
                            <img 
                              src={proof.file_url} 
                              alt="Project proof" 
                              className="w-full h-24 object-cover"
                            />
                            <div className="p-2">
                              <p className="text-xs text-deep-slate truncate">
                                {proof.file_name}
                              </p>
                              <p className="text-xs text-deep-slate">
                                {new Date(proof.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-deep-slate">No proofs uploaded yet.</p>
                    )}
                  </div>
                  
                  <AdminProofActions projectId={project.id} status={project.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}