import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FileText, Activity, PenLine, ExternalLink, Globe, Clock, Plus, LayoutTemplate, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

interface Post {
  _id: string
  title: string
  createdAt: string
}

interface Stats {
  posts: number
  recentPosts: Post[]
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ posts: 0, recentPosts: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => {
        const posts = Array.isArray(data) ? data : []
        const recentPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4)
        setStats({ posts: posts.length, recentPosts })
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [])

  const cards = [
    { label: 'Total Posts', value: loading ? '-' : stats.posts, icon: FileText, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { label: 'Content Sections', value: '2 Pages', icon: LayoutTemplate, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { label: 'System Status', value: 'Online', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div>
        <motion.h1 variants={item} className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.name || 'Admin'} 👋</motion.h1>
        <motion.p variants={item} className="text-slate-400 mt-2 text-sm leading-relaxed">Here's your high-level SaaS control panel overview.</motion.p>
      </div>

      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} 
                 className="card p-6 border-white/5 bg-[#0a1325]/50 backdrop-blur-md relative overflow-hidden group hover:border-white/10">
              <div className={`absolute -top-10 -right-10 w-32 h-32 ${card.bg} blur-[50px] rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-500`} />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${card.bg} ${card.border} border`}>
                  <Icon className={`w-5 h-5 ${card.color}`} strokeWidth={2} />
                </div>
              </div>

              <div className="relative z-10 mt-6">
                {loading ? (
                  <Skeleton className="h-10 w-24" />
                ) : (
                  <div className="text-4xl font-black text-white tracking-tighter">{card.value}</div>
                )}
                <div className="text-slate-400 text-sm font-medium mt-2">{card.label}</div>
              </div>
            </div>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={item} className="card lg:col-span-2 p-6 border-white/5 bg-[#0a1325]/50 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
            <Link to="/admin/posts" className="text-sm font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : stats.recentPosts.length > 0 ? (
              <div className="space-y-5">
                {stats.recentPosts.map((post) => (
                  <div key={post._id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{post.title} was published</p>
                      <p className="text-xs text-slate-500 mt-0.5">Updated on {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-sm text-slate-400 font-medium">No recent activity found.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="h-full">
          <div className="card p-6 border-white/5 bg-[#0a1325]/50 backdrop-blur-md h-full flex flex-col">
            <h2 className="text-lg font-bold text-white tracking-tight mb-6">Quick Actions</h2>
            <div className="flex flex-col gap-3 flex-1">
              <Link to="/admin/posts" className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="font-medium text-sm text-slate-200 group-hover:text-white">Create Post</div>
              </Link>
              <Link to="/admin/content" className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div className="font-medium text-sm text-slate-200 group-hover:text-white">Edit Homepage</div>
              </Link>
              <a href="/" target="_blank" className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="font-medium text-sm text-slate-200 group-hover:text-white">View Live Website</div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
