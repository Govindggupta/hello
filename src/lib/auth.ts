import { mockGetUser } from './mock-data'

export async function createClient() {
  // Mock client - not needed for mock data implementation
  return null
}

// Global variable to store the current user ID for the mock implementation
let currentUserId: string | null = null

export async function setCurrentUser(userId: string) {
  currentUserId = userId
}

export async function getCurrentUserId() {
  return currentUserId
}

export async function getUser() {
  try {
    if (!currentUserId) {
      return null
    }
    
    // Get the user record from the mock data
    const user = await mockGetUser(currentUserId)
    
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function isAuthenticated() {
  const user = await getUser()
  return !!user
}

export async function isAdmin() {
  const user = await getUser()
  // For now, we'll check if the user's email matches a specific admin email
  // In a real application, you would check the user's role in the users table
  return user?.contact_email === 'admin@samudra-chain.com'
}