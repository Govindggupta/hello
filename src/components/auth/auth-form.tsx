'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUpUser, signInUser, resetPassword } from '@/lib/actions/user-actions'

interface AuthFormProps {
  type: 'login' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [userType, setUserType] = useState('individual')
  const [description, setDescription] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [address, setAddress] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      
      if (type === 'signup') {
        formData.append('name', name)
        formData.append('type', userType)
        formData.append('description', description)
        formData.append('registration_number', registrationNumber)
        formData.append('address', address)
        formData.append('contact_phone', contactPhone)
        
        const result = await signUpUser(formData)
        
        if (result.error) {
          setError(result.error)
        } else {
          setMessage('Account created successfully! Signing you in...')
          
          // Automatically sign in the user after successful registration
          const signInResult = await signInUser(formData)
          
          if (signInResult.error) {
            setError('Account created but failed to sign in. Please try signing in manually.')
          } else {
            // Redirect to dashboard
            router.push('/dashboard')
            router.refresh() // Force a refresh to update the auth state
          }
        }
      } else {
        const result = await signInUser(formData)
        
        if (result.error) {
          setError(result.error)
        } else {
          // Redirect to dashboard
          router.push('/dashboard')
          router.refresh() // Force a refresh to update the auth state
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('email', email)
      
      const result = await resetPassword(formData)
      
      if (result.error) {
        setError(result.error)
      } else {
        setMessage('Password reset email sent! Check your inbox.')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'signup' && (
        <>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="userType" className="text-sm font-medium">
              User Type
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
              required
            >
              <option value="individual">Individual</option>
              <option value="organization">Organization</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description about yourself or your organization"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
              rows={3}
            />
          </div>
          
          {userType === 'organization' && (
            <>
              <div className="space-y-2">
                <label htmlFor="registrationNumber" className="text-sm font-medium">
                  Registration Number
                </label>
                <Input
                  id="registrationNumber"
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="Organization registration number"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Organization address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                  rows={2}
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <label htmlFor="contactPhone" className="text-sm font-medium">
              Contact Phone
            </label>
            <Input
              id="contactPhone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      {message && (
        <div className="text-green-500 text-sm p-2 bg-green-50 rounded">
          {message}
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Loading...' : type === 'signup' ? 'Create Account' : 'Sign In'}
      </Button>
      
      {type === 'login' && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-ocean-blue hover:underline"
            disabled={loading}
          >
            Forgot your password?
          </button>
        </div>
      )}
    </form>
  )
}