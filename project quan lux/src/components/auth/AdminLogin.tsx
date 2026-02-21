import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { hasFirebaseConfig } from '@/lib/firebase'

interface AdminLoginProps {
  onClose: () => void
}

export const AdminLogin = ({ onClose }: AdminLoginProps) => {
  const { signIn, isLocalAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    try {
      await signIn(email, password)
      onClose()
    } catch (err) {
      setError('Unable to sign in. Check credentials.')
    }
  }

  const showLocalHint = isLocalAuth && !hasFirebaseConfig

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-luxe">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Admin Access</p>
            <h2 className="mt-2 font-display text-2xl text-white">CEO Login</h2>
          </div>
          <button onClick={onClose} className="text-sm text-muted-foreground">
            Close
          </button>
        </div>

        {showLocalHint ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Local mode detected. Use your offline admin credentials.
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-border/60 bg-black/40 px-4 py-2 text-sm text-white"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <input
              className="mt-2 w-full rounded-xl border border-border/60 bg-black/40 px-4 py-2 text-sm text-white"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </div>
          {error ? <p className="text-xs text-rose-200">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-full bg-gold-500/90 px-4 py-2 text-sm font-semibold text-black"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
