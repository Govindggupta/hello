import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthForm } from '@/components/auth/auth-form'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm type="signup" />
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline text-ocean-blue">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}