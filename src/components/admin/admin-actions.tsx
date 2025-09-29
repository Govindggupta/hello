'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { approveOrganization, rejectOrganization } from '@/lib/actions'

interface AdminActionsProps {
  orgId: string
}

export function AdminActions({ orgId }: AdminActionsProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleApprove = async () => {
    setIsApproving(true)
    setMessage(null)
    
    try {
      const result = await approveOrganization(orgId)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Organization approved successfully!' })
        setTimeout(() => {
          router.refresh()
        }, 2000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    setIsRejecting(true)
    setMessage(null)
    
    try {
      const result = await rejectOrganization(orgId)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Organization rejected successfully!' })
        setTimeout(() => {
          router.refresh()
        }, 2000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button 
          onClick={handleApprove} 
          intent="primary"
          disabled={isApproving || isRejecting}
        >
          {isApproving ? 'Approving...' : 'Approve'}
        </Button>
        <Button 
          onClick={handleReject} 
          intent="outline"
          disabled={isApproving || isRejecting}
        >
          {isRejecting ? 'Rejecting...' : 'Reject'}
        </Button>
      </div>
      
      {message && (
        <div className={`text-sm p-2 rounded ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-500' 
            : 'bg-red-50 text-red-500'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}