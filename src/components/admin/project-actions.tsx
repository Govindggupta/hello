'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { approveProject, rejectProject } from '@/lib/actions'

interface ProjectActionsProps {
  projectId: string
}

export function ProjectActions({ projectId }: ProjectActionsProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const handleApprove = async () => {
    setIsApproving(true)
    setMessage(null)
    
    try {
      const result = await approveProject(projectId)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Project approved successfully!' })
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
      const result = await rejectProject(projectId)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Project rejected successfully!' })
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