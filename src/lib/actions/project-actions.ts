'use server'

import { 
  mockCreateProject, 
  mockGetProjects, 
  mockGetProject, 
  mockUpdateProject,
  mockGetProjectProofs,
  mockCreateProjectProof
} from '@/lib/mock-data'
import { revalidatePath } from 'next/cache'
import { getUser } from '@/lib/auth'

export async function createProject(formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'You must be signed in to create a project' }
  }
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const location_text = formData.get('location_text') as string
  const organization_id = formData.get('organization_id') as string
  
  if (!name || !description || !location_text || !organization_id) {
    return { error: 'All fields are required' }
  }
  
  try {
    const project = await mockCreateProject({
      name,
      description,
      location_text,
      organization_id,
      status: 'pending',
    })
    
    revalidatePath('/dashboard')
    return { success: true, project }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function getProjects() {
  try {
    const projects = await mockGetProjects()
    return { success: true, projects }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function getProject(id: string) {
  try {
    const project = await mockGetProject(id)
    
    if (!project) {
      return { error: 'Project not found' }
    }
    
    return { success: true, project }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'You must be signed in to update a project' }
  }
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const location_text = formData.get('location_text') as string
  
  if (!name || !description || !location_text) {
    return { error: 'All fields are required' }
  }
  
  try {
    const project = await mockUpdateProject(id, {
      name,
      description,
      location_text,
    })
    
    if (!project) {
      return { error: 'Project not found' }
    }
    
    revalidatePath('/dashboard')
    return { success: true, project }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function approveProject(id: string) {
  const user = await getUser()
  
  if (!user || user.contact_email !== 'admin@samudra-chain.com') {
    return { error: 'You must be an admin to approve projects' }
  }
  
  try {
    const project = await mockUpdateProject(id, {
      status: 'approved',
    })
    
    if (!project) {
      return { error: 'Project not found' }
    }
    
    revalidatePath('/admin')
    return { success: true, project }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function verifyProject(id: string) {
  const user = await getUser()
  
  if (!user || user.contact_email !== 'admin@samudra-chain.com') {
    return { error: 'You must be an admin to verify projects' }
  }
  
  try {
    const project = await mockUpdateProject(id, {
      status: 'verified',
    })
    
    if (!project) {
      return { error: 'Project not found' }
    }
    
    revalidatePath('/admin')
    return { success: true, project }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function rejectProject(id: string) {
  const user = await getUser()
  
  if (!user || user.contact_email !== 'admin@samudra-chain.com') {
    return { error: 'You must be an admin to reject projects' }
  }
  
  try {
    const project = await mockUpdateProject(id, {
      status: 'rejected',
    })
    
    if (!project) {
      return { error: 'Project not found' }
    }
    
    revalidatePath('/admin')
    return { success: true, project }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function getProjectProofs(projectId: string) {
  try {
    const proofs = await mockGetProjectProofs(projectId)
    return { success: true, proofs }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function createProjectProof(formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'You must be signed in to upload project proof' }
  }
  
  const project_id = formData.get('project_id') as string
  const file_url = formData.get('file_url') as string
  const file_name = formData.get('file_name') as string
  
  if (!project_id || !file_url || !file_name) {
    return { error: 'All fields are required' }
  }
  
  try {
    const proof = await mockCreateProjectProof({
      project_id,
      file_url,
      file_name,
    })
    
    revalidatePath(`/dashboard/projects/${project_id}`)
    return { success: true, proof }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function closeProject(id: string) {
  const user = await getUser()
  
  if (!user || user.contact_email !== 'admin@samudra-chain.com') {
    return { error: 'You must be an admin to close projects' }
  }
  
  try {
    const project = await mockUpdateProject(id, {
      status: 'closed',
    })
    
    if (!project) {
      return { error: 'Project not found' }
    }
    
    revalidatePath('/admin')
    return { success: true, project }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function uploadProof(formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'You must be signed in to upload proofs' }
  }
  
  const projectId = formData.get('project_id') as string
  const file = formData.get('proof') as File
  
  if (!projectId || !file) {
    return { error: 'Project ID and proof file are required' }
  }
  
  try {
    // In a real app, we would upload the file to storage
    // For mock purposes, we'll just create a mock URL
    const fileName = `${Date.now()}-${file.name}`
    const file_url = `/mock-uploads/${projectId}/${fileName}`
    
    // Create a proof record
    const proof = await mockCreateProjectProof({
      project_id: projectId,
      file_url,
      file_name: fileName,
    })
    
    revalidatePath(`/dashboard/projects/${projectId}`)
    return { success: true, proof }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}