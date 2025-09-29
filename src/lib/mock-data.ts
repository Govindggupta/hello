// Mock data store to simulate a database
export interface User {
  id: string
  name: string
  type: 'individual' | 'organization'
  description: string
  registration_number: string
  address: string
  contact_email: string
  contact_phone: string
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  description: string
  owner_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string
  location_text: string
  organization_id: string
  status: 'pending' | 'approved' | 'verified' | 'closed' | 'rejected'
  created_at: string
  updated_at: string
}

export interface ProjectProof {
  id: string
  project_id: string
  file_url: string
  file_name: string
  created_at: string
}

// Initial mock data
let mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    type: 'individual',
    description: 'System administrator',
    registration_number: '',
    address: '',
    contact_email: 'admin@samudra-chain.com',
    contact_phone: '',
    is_verified: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Test User',
    type: 'individual',
    description: 'Regular test user',
    registration_number: '',
    address: '',
    contact_email: 'test@example.com',
    contact_phone: '',
    is_verified: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

let mockOrganizations: Organization[] = []

let mockProjects: Project[] = []

let mockProjectProofs: ProjectProof[] = []

// Mock authentication functions
export async function mockSignUpUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if user with this email already exists
    const existingUser = mockUsers.find(user => user.contact_email === userData.contact_email)
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' }
    }
    
    // Create new user
    const newUser: User = {
      ...userData,
      id: (mockUsers.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    mockUsers.push(newUser)
    
    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function mockSignInUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Find user by email
    const user = mockUsers.find(user => user.contact_email === email)
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' }
    }
    
    if (!user.is_active) {
      return { success: false, error: 'Your account has been deactivated' }
    }
    
    // In a real app, we would verify the password here
    // For mock purposes, we'll accept any non-empty password
    if (!password || password.trim() === '') {
      return { success: false, error: 'Invalid email or password' }
    }
    
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function mockSignOutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real app, we would clear the session
    // For mock purposes, we'll just return success
    return { success: true }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function mockResetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Find user by email
    const user = mockUsers.find(user => user.contact_email === email)
    
    if (!user) {
      return { success: false, error: 'If an account with this email exists, a password reset link has been sent' }
    }
    
    // In a real app, we would send a password reset email
    // For mock purposes, we'll just return success
    return { success: true }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Mock data access functions
export async function mockGetUser(id: string): Promise<User | null> {
  return mockUsers.find(user => user.id === id) || null
}

export async function mockGetUserByEmail(email: string): Promise<User | null> {
  return mockUsers.find(user => user.contact_email === email) || null
}

export async function mockGetOrganizations(): Promise<Organization[]> {
  return mockOrganizations
}

export async function mockGetOrganization(id: string): Promise<Organization | null> {
  return mockOrganizations.find(org => org.id === id) || null
}

export async function mockCreateOrganization(organizationData: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Promise<Organization> {
  const newOrganization: Organization = {
    ...organizationData,
    id: (mockOrganizations.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  mockOrganizations.push(newOrganization)
  return newOrganization
}

export async function mockUpdateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | null> {
  const index = mockOrganizations.findIndex(org => org.id === id)
  if (index === -1) return null
  
  mockOrganizations[index] = {
    ...mockOrganizations[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  
  return mockOrganizations[index]
}

export async function mockGetProjects(): Promise<Project[]> {
  return mockProjects
}

export async function mockGetProject(id: string): Promise<Project | null> {
  return mockProjects.find(project => project.id === id) || null
}

export async function mockCreateProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const newProject: Project = {
    ...projectData,
    id: (mockProjects.length + 1).toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  mockProjects.push(newProject)
  return newProject
}

export async function mockUpdateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const index = mockProjects.findIndex(project => project.id === id)
  if (index === -1) return null
  
  mockProjects[index] = {
    ...mockProjects[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  
  return mockProjects[index]
}

export async function mockGetProjectProofs(projectId: string): Promise<ProjectProof[]> {
  return mockProjectProofs.filter(proof => proof.project_id === projectId)
}

export async function mockCreateProjectProof(proofData: Omit<ProjectProof, 'id' | 'created_at'>): Promise<ProjectProof> {
  const newProof: ProjectProof = {
    ...proofData,
    id: (mockProjectProofs.length + 1).toString(),
    created_at: new Date().toISOString(),
  }
  
  mockProjectProofs.push(newProof)
  return newProof
}

// Helper function to get mock data for debugging
export function getMockData() {
  return {
    users: mockUsers,
    organizations: mockOrganizations,
    projects: mockProjects,
    projectProofs: mockProjectProofs,
  }
}

// Helper function to reset mock data
export function resetMockData() {
  mockUsers = [
    {
      id: '1',
      name: 'Admin User',
      type: 'individual',
      description: 'System administrator',
      registration_number: '',
      address: '',
      contact_email: 'admin@samudra-chain.com',
      contact_phone: '',
      is_verified: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Test User',
      type: 'individual',
      description: 'Regular test user',
      registration_number: '',
      address: '',
      contact_email: 'test@example.com',
      contact_phone: '',
      is_verified: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ]
  mockOrganizations = []
  mockProjects = []
  mockProjectProofs = []
}