import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/login')
  }
  
  return (
    <div className="min-h-screen bg-sea-salt">
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>
    </div>
  )
}