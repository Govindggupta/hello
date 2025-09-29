'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createProject } from '@/lib/actions'
import Link from 'next/link'

interface ProjectFormProps {
  organizationId: string
  organizationName: string
}

export function ProjectForm({ organizationId, organizationName }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    // Add organization ID to form data
    formData.append('organization_id', organizationId)

    try {
      const result = await createProject(formData)
      
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Project submitted for approval!')
        setTimeout(() => {
          router.push(`/dashboard/organization/${organizationId}`)
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Create a new carbon restoration project for {organizationName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your Project Name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Brief description of your project"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="location_text" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location_text"
              name="location_text"
              type="text"
              placeholder="Project location (e.g., Mangrove Forest, Kerala)"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm p-2 bg-green-50 rounded">
              {success}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}