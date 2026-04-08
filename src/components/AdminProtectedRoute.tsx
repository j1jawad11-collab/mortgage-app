import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!token) {
      setIsValid(false)
      setIsVerifying(false)
      return
    }

    // Verify token validity with backend on every admin page navigation
    fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          setIsValid(true)
        } else {
          logout() // Clear invalid token from localStorage
          setIsValid(false)
        }
      })
      .catch(() => {
        logout()
        setIsValid(false)
      })
      .finally(() => {
        setIsVerifying(false)
      })
  }, [token, location.pathname, logout])

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#060e1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-teal-400 font-medium">Verifying Session...</p>
        </div>
      </div>
    )
  }

  if (!isValid) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
