import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export function AdminSettingsPage() {
  const { user, token } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ text: '', type: '' })

    try {
      const res = await fetch('/api/auth/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email, password: password || undefined })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update settings')

      setMsg({ text: 'Settings updated successfully!', type: 'success' })
      setPassword('') // clear password field
    } catch (err: any) {
      setMsg({ text: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account credentials</p>
      </div>

      <div className="bg-[#0b1528] border border-white/10 rounded-2xl max-w-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {msg.text && (
            <div className={`px-4 py-3 rounded-lg text-sm border ${
              msg.type === 'success' 
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {msg.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Password (leave blank to keep current)</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition placeholder-slate-600" 
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2 border-t border-white/10 mt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20"
            >
              {loading ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
