import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Loader2, KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Settings</h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">Manage your account credentials and system preferences</p>
      </div>

      <div className="bg-[#0b1528]/50 backdrop-blur-md border border-white/5 rounded-2xl max-w-xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
          {msg.text && (
            <div className={`animate-in fade-in slide-in-from-top-2 px-4 py-3 rounded-xl text-sm border flex items-center gap-3 ${
              msg.type === 'success' 
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              {msg.text}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-inner placeholder-slate-600" 
                />
              </div>
            </div>

            <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">New Password</label>
                 <span className="text-xs text-slate-500">Leave blank to keep current</span>
               </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-500" />
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-inner placeholder-slate-600" 
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
