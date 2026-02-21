import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { auth, hasFirebaseConfig } from '@/lib/firebase'

type LocalUser = {
  uid: string
  email: string
  displayName?: string
  isLocal: true
}

type AuthUser = User | LocalUser

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOutUser: () => Promise<void>
  isLocalAuth: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const LOCAL_EMAIL_KEY = 'quanlux-local-email'
const LOCAL_PASSWORD_KEY = 'quanlux-local-password'
const LOCAL_USER_KEY = 'quanlux-local-user'

const parseAdminEmails = (raw: string | undefined) => {
  if (!raw) return []
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

const ensureLocalCredentials = () => {
  const existingEmail = localStorage.getItem(LOCAL_EMAIL_KEY)
  const existingPassword = localStorage.getItem(LOCAL_PASSWORD_KEY)

  if (!existingEmail) {
    localStorage.setItem(LOCAL_EMAIL_KEY, 'admin@quanluxury.com')
  }
  if (!existingPassword) {
    localStorage.setItem(LOCAL_PASSWORD_KEY, 'QuanLux2024!')
  }
}

const getLocalCredentials = () => {
  ensureLocalCredentials()
  return {
    email: localStorage.getItem(LOCAL_EMAIL_KEY) || 'admin@quanluxury.com',
    password: localStorage.getItem(LOCAL_PASSWORD_KEY) || 'QuanLux2024!'
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminEmails, setAdminEmails] = useState<string[]>([])

  const isLocalAuth = !hasFirebaseConfig || !auth

  useEffect(() => {
    if (isLocalAuth) {
      const storedUser = localStorage.getItem(LOCAL_USER_KEY)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          setUser(null)
        }
      }
      const { email } = getLocalCredentials()
      setAdminEmails([email.toLowerCase()])
      setLoading(false)
      return
    }

    if (!auth) {
      setLoading(false)
      return
    }

    setPersistence(auth, browserLocalPersistence).catch(() => undefined)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [isLocalAuth])

  useEffect(() => {
    if (isLocalAuth) return

    const envAdmins = parseAdminEmails(
      import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL
    )

    if (envAdmins.length > 0) {
      setAdminEmails(envAdmins)
      return
    }

    const storedAdmin = localStorage.getItem('quanlux-admin-email')
    if (storedAdmin) {
      setAdminEmails([storedAdmin.toLowerCase()])
    }
  }, [isLocalAuth])

  useEffect(() => {
    if (isLocalAuth) return
    if (!user || adminEmails.length > 0) return
    const normalized = user.email?.toLowerCase()
    if (!normalized) return
    localStorage.setItem('quanlux-admin-email', normalized)
    setAdminEmails([normalized])
  }, [user, adminEmails.length, isLocalAuth])

  const signIn = async (email: string, password: string) => {
    if (isLocalAuth) {
      const localCredentials = getLocalCredentials()
      if (email.toLowerCase() !== localCredentials.email.toLowerCase()) {
        throw new Error('Invalid email or password')
      }
      if (password !== localCredentials.password) {
        throw new Error('Invalid email or password')
      }

      const localUser: LocalUser = {
        uid: 'local-admin',
        email: localCredentials.email,
        displayName: 'Local Admin',
        isLocal: true
      }
      setUser(localUser)
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser))
      return
    }

    if (!auth) return
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOutUser = async () => {
    if (isLocalAuth) {
      setUser(null)
      localStorage.removeItem(LOCAL_USER_KEY)
      return
    }

    if (!auth) return
    await signOut(auth)
  }

  const isAdmin = useMemo(() => {
    const email = user?.email?.toLowerCase()
    if (!email || adminEmails.length === 0) return false
    return adminEmails.includes(email)
  }, [user, adminEmails])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOutUser, isLocalAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
