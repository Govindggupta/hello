import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'
import { getProject, getProjectProofs } from '@/lib/actions'
import { mockGetOrganization } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QRCode } from '@/components/ui/qr-code'
import Link from 'next/link'

interface ProjectWithDetails {
  id: string
  name: string
  description?: string
  location_text: string
  status: 'pending' | 'approved' | 'verified' | 'closed' | 'rejected'
  organization_id: string
  created_at: string
  organization: {
    name: string
    owner_id: string
  } | null
  proofs: Array<{
    id: string
    file_url: string
    file_name: string
    created_at: string
  }>
}

async function getProjectWithDetails(projectId: string): Promise<ProjectWithDetails | null> {
  const user = await getUser()
  
  if (!user) {
    return null
  }
  
  const result = await getProject(projectId)
  
  if (result.error || !result.project) {
    console.error('Error fetching project:', result.error)
    return null
  }
  
  // Get organization details
  const organization = await mockGetOrganization(result.project.organization_id)
  
  // Get project proofs
  const proofsResult = await getProjectProofs(projectId)
  
  return {
    ...result.project,
    organization: organization ? {
      name: organization.name,
      owner_id: organization.owner_id
    } : null,
    proofs: proofsResult.success ? proofsResult.proofs : []
  } as ProjectWithDetails
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  const project = await getProjectWithDetails(params.projectId) as ProjectWithDetails
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  if (!project) {
    notFound()
  }
  
  // Check if user owns the project
  if (!project.organization || project.organization.owner_id !== user.id) {
    redirect('/dashboard')
  }
  
  // Generate the upload URL for the QR code
  const uploadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/projects/${params.projectId}/upload`
  
  return (
    <div className="py-8">
      <div className="mb-6">
        <Link href={`/dashboard/organization/${project.organization_id}`} className="text-ocean-blue hover:underline">
          ← Back to Organization
        </Link>
        <h1 className="text-2xl font-bold mt-2">{project.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-1 rounded ${
            project.status === 'approved' 
              ? 'bg-green-100 text-green-800' 
              : project.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : project.status === 'verified'
              ? 'bg-blue-100 text-blue-800'
              : project.status === 'closed'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          <span className="text-sm text-deep-slate">
            Created on {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {project.description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
          </CardContent>
        </Card>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{project.location_text}</p>
        </CardContent>
      </Card>
      
      {project.status === 'approved' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Proof</CardTitle>
            <CardDescription>
              Scan this QR code with your mobile device to upload photographic proof
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <QRCode value={uploadUrl} size={200} />
            <Link href={uploadUrl} className="mt-4">
              <Button intent="outline" size="sm">Open Upload Page</Button>
            </Link>
          </CardContent>
        </Card>
      )}
      
     {project.status === 'verified' && (
       <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
         <CardHeader>
           <CardTitle className="text-green-800 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             Blue Carbon Credits (BCCs) Generated
           </CardTitle>
           <CardDescription className="text-green-700">
             Your project has been verified and carbon credits have been tokenized on the blockchain
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div className="text-center py-4">
             <div className="text-3xl font-bold text-green-800 mb-2">1,250 BCCs</div>
             <p className="text-green-700">These credits represent the carbon sequestration achieved by your project</p>
           </div>
         </CardContent>
       </Card>
     )}
     
      <Card>
        <CardHeader>
          <CardTitle>Project Proofs</CardTitle>
          <CardDescription>
            Photographic evidence uploaded for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {project.proofs && project.proofs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.proofs.map((proof: any) => (
                <div key={proof.id} className="border border-light-gray rounded-lg overflow-hidden">
                  <img
                    src={proof.file_url}
                    alt="Project proof"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm text-deep-slate">
                      Uploaded on {new Date(proof.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-deep-slate">No proofs uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}