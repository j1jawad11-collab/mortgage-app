import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LayoutDashboard, FileText, Settings, LogOut, PenLine } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Blog Posts', path: '/admin/posts', icon: FileText },
  { label: 'Content', path: '/admin/content', icon: PenLine },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // derive simple page title from path
  const pathParts = location.pathname.split('/').filter(Boolean)
  const pageTitle = pathParts.length > 1 ? pathParts[1] : 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a1325]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#060c18] border-r border-white/5 flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/10 blur-[50px] rounded-full" />
          <span className="text-3xl font-black text-white tracking-tight relative z-10">Delta<span className="text-teal-400">Admin</span></span>
          <p className="text-xs text-slate-400 mt-2 font-medium bg-white/5 px-3 py-1 rounded-full relative z-10 border border-white/5">{user?.email}</p>
        </div>
        
        <div className="px-6 py-4 text-xs font-semibold text-slate-600 tracking-wider uppercase mt-4">Menu</div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link key={item.path} to={item.path}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all relative overflow-hidden ${active ? 'bg-teal-500/10 text-teal-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-teal-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-400 rounded-r-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />}
                <Icon className={`w-5 h-5 transition-colors ${active ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-6 border-t border-white/5 bg-[#060c18]/50">
          <button onClick={handleLogout}
            className="group w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
            <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-auto relative flex flex-col">
        {/* Subtle background glow */}
        <div className="pointer-events-none fixed top-0 left-64 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
        
        {/* Header decoration */}
        <header className="sticky top-0 z-10 bg-[#0a1325]/80 backdrop-blur-xl border-b border-white/5 min-h-[4rem] flex flex-shrink-0 items-center px-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-slate-400">
             <span>Admin Panel</span>
             <span className="text-slate-600">/</span>
             <span className="text-white font-medium capitalize">{pageTitle}</span>
          </div>
        </header>

        <div className="relative z-0 flex-1 p-8 md:p-12 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
