import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function FaviconLogo({ size = 48 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size} style={{ borderRadius: 12 }}>
      <defs>
        <linearGradient id="lp-roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="lp-bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f1e3d" />
          <stop offset="100%" stopColor="#1a2f57" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="96" ry="96" fill="url(#lp-bgGrad)" />
      <rect x="156" y="272" width="200" height="160" rx="8" fill="white" opacity="0.95" />
      <polygon points="256,100 100,272 412,272" fill="url(#lp-roofGrad)" />
      <rect x="218" y="352" width="76" height="80" rx="6" fill="#0f1e3d" opacity="0.85" />
      <text x="256" y="418" fontFamily="Georgia, serif" fontSize="64" fontWeight="bold"
        textAnchor="middle" fill="url(#lp-roofGrad)">D</text>
    </svg>
  )
}

export function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Sign In — Delta Admin'
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      login(data.token, data.user)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060e1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          <FaviconLogo size={56} />
          <h1 className="text-3xl font-black text-white tracking-tight">Delta<span className="text-teal-400">Admin</span></h1>
          <p className="text-slate-400 mt-1">Sign in to your admin panel</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#0b1528] border border-white/10 rounded-2xl p-8 space-y-5 shadow-xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition placeholder-slate-500"
              placeholder="admin@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition placeholder-slate-500"
              placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-teal-500/20">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
