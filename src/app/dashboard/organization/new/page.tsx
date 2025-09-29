import Link from 'next/link'
import { OrganizationForm } from '@/components/forms/organization-form'

export default function NewOrganizationPage() {
  return (
    <div className="py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-ocean-blue hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
      
      <OrganizationForm />
    </div>
  )
}