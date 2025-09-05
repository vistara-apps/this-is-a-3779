import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import Login from './Login'
import Signup from './Signup'
import { Loader2 } from 'lucide-react'

const AuthWrapper = ({ children }) => {
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const { isAuthenticated, isLoading, initialize } = useAuthStore()

  useEffect(() => {
    // Initialize auth state on app load
    initialize()
  }, [initialize])

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading AdSpark AI</h2>
          <p className="text-dark-muted">Please wait while we set things up...</p>
        </div>
      </div>
    )
  }

  // Show auth forms if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'signup') {
      return (
        <Signup
          onSwitchToLogin={() => setAuthMode('login')}
          onSuccess={() => setAuthMode('login')}
        />
      )
    }

    return (
      <Login
        onSwitchToSignup={() => setAuthMode('signup')}
        onSuccess={() => {
          // Authentication successful, the store will update isAuthenticated
        }}
      />
    )
  }

  // User is authenticated, show the main app
  return children
}

export default AuthWrapper
