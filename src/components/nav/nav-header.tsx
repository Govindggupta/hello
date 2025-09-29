'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getUser, isAdmin } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { AuthActions } from '@/components/auth/auth-actions'

export function NavHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminState, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser()
      setIsLoggedIn(!!user)
      
      // Check if user is admin
      if (user) {
        const adminStatus = await isAdmin()
        setIsAdmin(adminStatus)
      }
    }

    checkUser()

    // Check for auth state changes
    const interval = setInterval(checkUser, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="bg-white border-b border-light-gray py-4">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-ocean-blue">
          Samudra Chain
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-deep-slate hover:text-ocean-blue transition-colors">
            Home
          </Link>
          <Link href="/projects" className="text-deep-slate hover:text-ocean-blue transition-colors">
            Projects
          </Link>
          <Link href="/about" className="text-deep-slate hover:text-ocean-blue transition-colors">
            About
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-deep-slate hover:text-ocean-blue transition-colors">
              Dashboard
            </Link>
          )}
          {isAdminState && (
            <>
              <Link href="/admin" className="text-deep-slate hover:text-ocean-blue transition-colors">
                Admin
              </Link>
              <Link href="/admin/projects" className="text-deep-slate hover:text-ocean-blue transition-colors">
                Project Requests
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <AuthActions />
          ) : (
            <>
              <Link href="/login">
                <Button intent="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button intent="primary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}