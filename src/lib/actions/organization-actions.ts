'use server'

import { 
  mockCreateOrganization, 
  mockGetOrganizations, 
  mockGetOrganization, 
  mockUpdateOrganization 
} from '@/lib/mock-data'
import { revalidatePath } from 'next/cache'
import { getUser } from '@/lib/auth'

export async function createOrganization(formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'You must be signed in to create an organization' }
  }
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  
  if (!name || !description) {
    return { error: 'Name and description are required' }
  }
  
  try {
    const organization = await mockCreateOrganization({
      name,
      description,
      owner_id: user.id,
      status: 'pending',
    })
    
    revalidatePath('/dashboard')
    return { success: true, organization }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function getOrganizations() {
  try {
    const organizations = await mockGetOrganizations()
    return { success: true, organizations }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function getOrganization(id: string) {
  try {
    const organization = await mockGetOrganization(id)
    
    if (!organization) {
      return { error: 'Organization not found' }
    }
    
    return { success: true, organization }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function updateOrganization(id: string, formData: FormData) {
  const user = await getUser()
  
  if (!user) {
    return { error: 'You must be signed in to update an organization' }
  }
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  
  if (!name || !description) {
    return { error: 'Name and description are required' }
  }
  
  try {
    const organization = await mockUpdateOrganization(id, {
      name,
      description,
    })
    
    if (!organization) {
      return { error: 'Organization not found' }
    }
    
    revalidatePath('/dashboard')
    return { success: true, organization }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function approveOrganization(id: string) {
  const user = await getUser()
  
  if (!user || user.contact_email !== 'admin@samudra-chain.com') {
    return { error: 'You must be an admin to approve organizations' }
  }
  
  try {
    const organization = await mockUpdateOrganization(id, {
      status: 'approved',
    })
    
    if (!organization) {
      return { error: 'Organization not found' }
    }
    
    revalidatePath('/admin')
    return { success: true, organization }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function rejectOrganization(id: string) {
  const user = await getUser()
  
  if (!user || user.contact_email !== 'admin@samudra-chain.com') {
    return { error: 'You must be an admin to reject organizations' }
  }
  
  try {
    const organization = await mockUpdateOrganization(id, {
      status: 'rejected',
    })
    
    if (!organization) {
      return { error: 'Organization not found' }
    }
    
    revalidatePath('/admin')
    return { success: true, organization }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}