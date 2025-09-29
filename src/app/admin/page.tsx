import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getOrganizations, getProjects } from '@/lib/actions'

async function getPendingOrganizationsCount() {
  const result = await getOrganizations()
  
  if (result.error || !result.organizations) {
    console.error('Error fetching pending organizations count:', result.error)
    return 0
  }
  
  return result.organizations.filter(org => org.status === 'pending').length
}

async function getPendingProjectsCount() {
  const result = await getProjects()
  
  if (result.error || !result.projects) {
    console.error('Error fetching pending projects count:', result.error)
    return 0
  }
  
  return result.projects.filter(project => project.status === 'pending').length
}

export default async function AdminPage() {
  const pendingOrgCount = await getPendingOrganizationsCount()
  const pendingProjectCount = await getPendingProjectsCount()
  
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-deep-slate">Manage organizations, projects, and system settings</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Organizations</CardTitle>
            <CardDescription>
              Organization requests awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingOrgCount}</div>
            <Link href="/admin/requests">
              <Button className="mt-4" intent="primary">View Requests</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Projects</CardTitle>
            <CardDescription>
              Carbon restoration projects awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingProjectCount}</div>
            <Link href="/admin/projects">
              <Button className="mt-4" intent="primary">View Projects</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System</CardTitle>
            <CardDescription>
              Manage system settings and users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings">
              <Button intent="outline">System Settings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/requests">
              <Button className="w-full" intent="primary">Review Organization Requests</Button>
            </Link>
            <Link href="/admin/projects">
              <Button className="w-full" intent="primary">Review Project Requests</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}