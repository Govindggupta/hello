'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { uploadProof } from '@/lib/actions'

export default function UploadPage({
  params,
}: {
  params: { projectId: string }
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [project, setProject] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get the return URL from query params, default to dashboard
  const returnUrl = searchParams.get('returnUrl') || '/dashboard'
  
  useEffect(() => {
    // Fetch project details
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.projectId}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data)
        } else {
          setMessage({ type: 'error', text: 'Project not found' })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to fetch project details' })
      }
    }
    
    fetchProject()
  }, [params.projectId])
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploading(true)
    setMessage(null)
    
    try {
      const formData = new FormData()
      formData.append('project_id', params.projectId)
      formData.append('proof', file)
      
      const result = await uploadProof(formData)
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Proof uploaded successfully!' })
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push(returnUrl)
        }, 2000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Project Proof</CardTitle>
          <CardDescription>
            Take a photo to submit as proof for your carbon restoration project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {project && (
            <div className="mb-4">
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-deep-slate">{project.location_text}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Take a Photo
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full text-sm text-deep-slate
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-ocean-blue file:text-white
                  hover:file:bg-blue-600
                  disabled:opacity-50"
              />
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
            
            <div className="flex justify-between">
              <Button 
                onClick={() => router.push(returnUrl)} 
                intent="outline"
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}