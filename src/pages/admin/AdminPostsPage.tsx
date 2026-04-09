import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon, FileText } from 'lucide-react'

interface Post {
  _id: string
  title: string
  category: string
  excerpt: string
  content: string
  imageUrl: string
  createdAt: string
}

const emptyForm = { title: '', category: 'General', excerpt: '', content: '', imageUrl: '' }

export function AdminPostsPage() {
  const { token } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const loadPosts = () => {
    setLoading(true)
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadPosts() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (p: Post) => { setEditing(p); setForm({ title: p.title, category: p.category, excerpt: p.excerpt, content: p.content, imageUrl: p.imageUrl }); setShowForm(true) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = editing ? { id: editing._id, ...form } : form
      const res = await fetch('/api/posts', { method: editing ? 'PUT' : 'POST', headers: authHeaders, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg(editing ? 'Post updated!' : 'Post created!')
      setShowForm(false)
      loadPosts()
    } catch (err: any) {
      setMsg('Error: ' + err.message)
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return
    
    // Optimistic UI update could go here, but let's stick to safe refetching
    await fetch('/api/posts', { method: 'DELETE', headers: authHeaders, body: JSON.stringify({ id }) })
    loadPosts()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Blog Posts</h1>
          <p className="text-slate-400 mt-2 text-sm">Manage your platform's content and resources. {posts.length} entries.</p>
        </div>
        <button onClick={openCreate} 
                className="group flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95">
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          New Post
        </button>
      </div>

      {msg && (
        <div className="animate-in fade-in slide-in-from-top-2 px-4 py-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl text-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          {msg}
        </div>
      )}

      {loading ? (
        <div className="bg-[#0b1528]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      ) : (
        <div className="bg-[#0b1528]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {posts.length === 0 ? (
            <div className="p-16 flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                 <FileText className="w-8 h-8 text-slate-500" />
               </div>
               <h3 className="text-lg font-medium text-white mb-1">No posts yet</h3>
               <p className="text-slate-400 text-sm">Get started by creating your first blog post.</p>
               <button onClick={openCreate} className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
                 Create Post
               </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#060c18]/80 text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-2xl">Post</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {posts.map(p => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                             <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                          ) : (
                             <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                               <ImageIcon className="w-4 h-4 text-teal-500/50" />
                             </div>
                          )}
                          <div>
                            <div className="font-medium text-white text-base leading-tight">{p.title}</div>
                            <div className="text-xs text-slate-500 mt-1 truncate max-w-xs">{p.excerpt || 'No excerpt'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs font-medium border border-white/10">
                           {p.category}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                         {new Date(p.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit Post">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete Post">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#060c18]/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !saving && setShowForm(false)} />
          
          <div className="relative bg-[#0b1528] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.01]">
              <h2 className="text-xl font-bold text-white tracking-tight">{editing ? 'Edit Post' : 'Create New Post'}</h2>
              <button type="button" onClick={() => setShowForm(false)} disabled={saving} className="text-slate-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form id="post-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Title *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-600" 
                    placeholder="E.g. Bank of Canada holds rates steady" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none cursor-pointer">
                      {['General', 'Market Updates', 'First-Time Buyers', 'Refinancing', 'Education', 'Investing'].map(c => (
                        <option key={c} value={c} className="bg-[#0b1528]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Image URL</label>
                    <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-slate-600" />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Short Excerpt</label>
                  <textarea rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    placeholder="Brief summary shown on the blog listing page..."
                    className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none placeholder-slate-600" />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Full Content *</label>
                  <textarea required rows={10} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Supports markdown or straight text..."
                    className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-y placeholder-slate-600" />
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} disabled={saving}
                className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-slate-300 font-medium rounded-xl text-sm transition-all border border-transparent">
                Cancel
              </button>
              <button type="submit" form="post-form" disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Saving...' : editing ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
