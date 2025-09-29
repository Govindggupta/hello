import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()
  
  if (!admin) {
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