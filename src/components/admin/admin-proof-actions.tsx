'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { verifyProject, closeProject } from '@/lib/actions'

interface AdminProofActionsProps {
  projectId: string
  status: string
}

export function AdminProofActions({ projectId, status }: AdminProofActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const handleVerify = async () => {
    setIsProcessing(true)
    setMessage(null)
    
    try {
      const result = await verifyProject(projectId)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Project verified successfully!' })
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleClose = async () => {
    setIsProcessing(true)
    setMessage(null)
    
    try {
      const result = await closeProject(projectId)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Project closed successfully!' })
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsProcessing(false)
    }
  }
  
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {status === 'approved' && (
        <Button 
          onClick={handleVerify} 
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? 'Processing...' : 'Verify Project'}
        </Button>
      )}
      
      {status === 'verified' && (
        <Button 
          onClick={handleClose} 
          disabled={isProcessing}
          className="bg-gray-600 hover:bg-gray-700"
        >
          {isProcessing ? 'Processing...' : 'Close Project'}
        </Button>
      )}
      
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