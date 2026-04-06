import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: '📊' },
  { label: 'Blog Posts', path: '/admin/posts', icon: '📝' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[#060e1e]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1528] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <span className="text-2xl font-black text-white tracking-tight">Delta<span className="text-teal-400">Admin</span></span>
          <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
