'use client'

import { useRouter } from 'next/navigation'
import { signOutUser } from '@/lib/actions/user-actions'
import { Button } from '@/components/ui/button'

export function AuthActions() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOutUser()
    router.refresh()
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={handleSignOut} intent="outline">
        Sign Out
      </Button>
    </div>
  )
}