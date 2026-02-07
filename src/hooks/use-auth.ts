import { useState, useEffect } from 'react'
import { Id } from '../../convex/_generated/dataModel'

interface User {
  userId: Id<"users">
  role: 'organizer' | 'participant'
  email?: string
  name?: string
}

export function useAuth() {
  // Read localStorage synchronously so route guards don't "flash" logged-out state.
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('campusconnect_user')
      return storedUser ? (JSON.parse(storedUser) as User) : null
    } catch {
      return null
    }
  })
  const [loading] = useState(false)

  useEffect(() => {
    // Keep in sync across tabs/windows.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'campusconnect_user') return
      try {
        setUser(e.newValue ? (JSON.parse(e.newValue) as User) : null)
      } catch {
        setUser(null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem('campusconnect_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('campusconnect_user')
  }

  return { user, loading, login, logout }
}
