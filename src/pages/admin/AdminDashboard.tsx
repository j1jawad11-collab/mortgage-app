import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { FileText, Building, Activity, PenLine, ExternalLink, Globe } from 'lucide-react'

interface Stats {
  posts: number
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ posts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => {
        setStats({ posts: Array.isArray(data) ? data.length : 0 })
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [])

  const cards = [
    { label: 'Blog Posts', value: stats.posts, icon: FileText, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { label: 'Lenders', value: '50+', icon: Building, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { label: 'System Status', value: 'Live', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.name} 👋</h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">Here's your website's high-level overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={card.label} 
                 className={`animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-${(i + 1) * 100} 
                            bg-[#0a1325]/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full`} />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${card.bg} ${card.border} border`}>
                  <Icon className={`w-6 h-6 ${card.color}`} strokeWidth={1.5} />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.bg} ${card.color} ${card.border} border`}>
                  Active
                </span>
              </div>

              <div className="relative z-10 mt-6">
                {loading ? (
                  <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse" />
                ) : (
                  <div className="text-4xl font-black text-white tracking-tighter">{card.value}</div>
                )}
                <div className="text-slate-400 text-sm font-medium mt-2">{card.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-[#0a1325]/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-300">
        <h2 className="text-lg font-semibold text-white mb-6 tracking-tight">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a href="/admin/posts" className="group flex items-center gap-2 px-5 py-2.5 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-400 rounded-xl text-sm font-semibold transition-all">
            <PenLine className="w-4 h-4" />
            Manage Posts
          </a>
          <a href="/admin/content" className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-xl text-sm font-semibold transition-all">
            <Globe className="w-4 h-4" />
            Edit Content
          </a>
          <a href="/" target="_blank" className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all">
            <ExternalLink className="w-4 h-4" />
            View Live Website
          </a>
        </div>
      </div>
    </div>
  )
}
