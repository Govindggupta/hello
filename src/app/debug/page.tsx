import { mockSignUpUser, mockSignInUser, mockGetUser, getMockData } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

async function getAuthDebugInfo() {
  // Get current user from mock data
  const currentUser = await mockGetUser('1') // Default admin user
  
  // Try to sign up a test user
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'password123'
  
  const signUpResult = await mockSignUpUser({
    name: 'Test User',
    type: 'individual',
    description: 'Test user for debugging',
    registration_number: '',
    address: '',
    contact_email: testEmail,
    contact_phone: '',
    is_verified: false,
    is_active: true,
  })
  
  // Try to sign in with the test user
  let signInResult = null
  
  if (signUpResult.success) {
    signInResult = await mockSignInUser(testEmail, testPassword)
  }
  
  return {
    currentUser: currentUser ? { id: currentUser.id, email: currentUser.contact_email } : null,
    testUser: {
      email: testEmail,
      signUpSuccess: signUpResult.success,
      signUpError: signUpResult.error,
      signInSuccess: signInResult?.success || false,
      signInError: signInResult?.error,
    },
    mockData: getMockData()
  }
}

export default async function DebugPage() {
  const debugInfo = await getAuthDebugInfo()
  
  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current User</CardTitle>
        </CardHeader>
        <CardContent>
          {debugInfo.currentUser ? (
            <div>
              <p><strong>ID:</strong> {debugInfo.currentUser.id}</p>
              <p><strong>Email:</strong> {debugInfo.currentUser.email}</p>
            </div>
          ) : (
            <p>No user currently signed in</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Test User Creation</CardTitle>
          <CardDescription>
            This section tests creating a new user and immediately signing in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Test Email:</strong> {debugInfo.testUser.email}</p>
            <p>
              <strong>Sign Up:</strong> 
              <span className={debugInfo.testUser.signUpSuccess ? 'text-green-500' : 'text-red-500'}>
                {debugInfo.testUser.signUpSuccess ? ' Success' : ' Failed'}
              </span>
            </p>
            {debugInfo.testUser.signUpError && (
              <p className="text-red-500">Sign Up Error: {debugInfo.testUser.signUpError}</p>
            )}
            <p>
              <strong>Sign In:</strong> 
              <span className={debugInfo.testUser.signInSuccess ? 'text-green-500' : 'text-red-500'}>
                {debugInfo.testUser.signInSuccess ? ' Success' : ' Failed'}
              </span>
            </p>
            {debugInfo.testUser.signInError && (
              <p className="text-red-500">Sign In Error: {debugInfo.testUser.signInError}</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Mock Data</CardTitle>
          <CardDescription>
            Current state of the mock data store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Users ({debugInfo.mockData.users.length})</h3>
              <ul className="list-disc pl-5 mt-2">
                {debugInfo.mockData.users.map(user => (
                  <li key={user.id}>{user.name} ({user.contact_email})</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Organizations ({debugInfo.mockData.organizations.length})</h3>
              <ul className="list-disc pl-5 mt-2">
                {debugInfo.mockData.organizations.map(org => (
                  <li key={org.id}>{org.name} ({org.status})</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Projects ({debugInfo.mockData.projects.length})</h3>
              <ul className="list-disc pl-5 mt-2">
                {debugInfo.mockData.projects.map(project => (
                  <li key={project.id}>{project.name} ({project.status})</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Button
          onClick={() => window.location.href = '/'}
          intent="outline"
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}