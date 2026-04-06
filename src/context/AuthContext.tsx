import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AdminUser {
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: AdminUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'))
  const [user, setUser] = useState<AdminUser | null>(() => {
    const u = localStorage.getItem('admin_user')
    return u ? JSON.parse(u) : null
  })

  const login = (newToken: string, newUser: AdminUser) => {
    localStorage.setItem('admin_token', newToken)
    localStorage.setItem('admin_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
