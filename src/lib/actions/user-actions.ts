'use server'

import {
  mockSignUpUser,
  mockSignInUser,
  mockSignOutUser,
  mockResetPassword
} from '@/lib/mock-data'
import { revalidatePath } from 'next/cache'
import { setCurrentUser } from '@/lib/auth'

export async function signUpUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const type = formData.get('type') as 'individual' | 'organization' || 'individual'
  const description = formData.get('description') as string || ''
  const registration_number = formData.get('registration_number') as string || ''
  const address = formData.get('address') as string || ''
  const contact_phone = formData.get('contact_phone') as string || ''
  
  try {
    const result = await mockSignUpUser({
      name,
      type,
      description,
      registration_number,
      address,
      contact_email: email,
      contact_phone,
      is_verified: false,
      is_active: true,
    })
    
    if (result.error) {
      return { error: result.error }
    }
    
    if (result.success && result.user) {
      // Set the current user for the mock implementation
      await setCurrentUser(result.user.id)
      
      revalidatePath('/')
      return { success: true, user: result.user }
    }
    
    return { error: 'Failed to create user account' }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function signInUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  try {
    const result = await mockSignInUser(email, password)
    
    if (result.error) {
      return { error: result.error }
    }
    
    if (result.success && result.user) {
      // Set the current user for the mock implementation
      await setCurrentUser(result.user.id)
      
      revalidatePath('/')
      return { success: true, user: result.user }
    }
    
    return { error: 'Invalid login credentials' }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function signOutUser() {
  try {
    const result = await mockSignOutUser()
    
    if (result.error) {
      return { error: result.error }
    }
    
    // Clear the current user for the mock implementation
    await setCurrentUser('')
    
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string
  
  try {
    const result = await mockResetPassword(email)
    
    if (result.error) {
      return { error: result.error }
    }
    
    return { success: true }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}