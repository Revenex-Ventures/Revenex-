import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

  export interface AuthUser {
    id: number
    name: string
    email: string
    role: string
  }

  interface AuthContextType {
    user: AuthUser | null
    loading: boolean
    login: (token: string, user: AuthUser) => void
    logout: () => Promise<void>
  }

  const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => {},
    logout: async () => {},
  })

  function decodeToken(token: string): AuthUser | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as {
        id?: number; name?: string; email?: string; role?: string; exp?: number
      }
      if (!payload.id || !payload.email) return null
      if (payload.exp && payload.exp * 1000 < Date.now()) return null
      return { id: payload.id, name: payload.name ?? '', email: payload.email, role: payload.role ?? 'user' }
    } catch {
      return null
    }
  }

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const token = localStorage.getItem('revenex_token')
      if (token) {
        const decoded = decodeToken(token)
        setUser(decoded)
      }
      setLoading(false)
    }, [])

    const login = useCallback((token: string, userData: AuthUser) => {
      localStorage.setItem('revenex_token', token)
      localStorage.setItem('revenex_session', JSON.stringify({ email: userData.email, name: userData.name, loggedIn: true }))
      setUser(userData)
    }, [])

    const logout = useCallback(async () => {
      try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }) } catch { /* ignore */ }
      localStorage.removeItem('revenex_token')
      localStorage.removeItem('revenex_session')
      setUser(null)
    }, [])

    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  }

  export const useAuth = () => useContext(AuthContext)
  