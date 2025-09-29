import { NextResponse } from 'next/server'
import { getProject } from '@/lib/actions'

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const result = await getProject(params.projectId)
    
    if (result.error || !result.project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Return only the fields that were originally selected
    const { id, name, location_text, status } = result.project
    return NextResponse.json({ id, name, location_text, status })
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}