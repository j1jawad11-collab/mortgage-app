import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

interface Stats {
  posts: number
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ posts: 0 })

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => setStats({ posts: Array.isArray(data) ? data.length : 0 }))
      .catch(() => {})
  }, [])

  const cards = [
    { label: 'Blog Posts', value: stats.posts, icon: '📝', color: 'teal' },
    { label: 'Lenders', value: '50+', icon: '🏦', color: 'blue' },
    { label: 'Status', value: 'Live', icon: '✅', color: 'green' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name} 👋</h1>
        <p className="text-slate-400 mt-1">Here&apos;s what&apos;s happening with your mortgage website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map(card => (
          <div key={card.label} className="bg-[#0b1528] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${card.color}-500/10 text-${card.color}-400 border border-${card.color}-500/20`}>
                Active
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{card.value}</div>
            <div className="text-slate-400 text-sm mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0b1528] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/posts" className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-lg text-sm font-medium transition-all">
            ✏️ Manage Posts
          </a>
          <a href="/" target="_blank" className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-all">
            🌐 View Website
          </a>
        </div>
      </div>
    </div>
  )
}
