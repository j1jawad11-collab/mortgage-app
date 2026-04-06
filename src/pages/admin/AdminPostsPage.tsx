import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

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
    if (!confirm('Delete this post?')) return
    await fetch('/api/posts', { method: 'DELETE', headers: authHeaders, body: JSON.stringify({ id }) })
    loadPosts()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-slate-400 mt-1">{posts.length} posts in database</p>
        </div>
        <button onClick={openCreate} className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20">
          + New Post
        </button>
      </div>

      {msg && <div className="mb-4 px-4 py-3 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-lg text-sm">{msg}</div>}

      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : (
        <div className="bg-[#0b1528] border border-white/10 rounded-2xl overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No posts yet. Create your first post!</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-left">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.02] text-slate-300">
                    <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-teal-500/10 text-teal-400 rounded-full text-xs border border-teal-500/20">{p.category}</span></td>
                    <td className="px-6 py-4 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => openEdit(p)} className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs border border-blue-500/20 transition-all">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/20 transition-all">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1528] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Post' : 'Create New Post'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition">
                  {['General', 'Market Updates', 'First-Time Buyers', 'Refinancing', 'Education', 'Investing'].map(c => (
                    <option key={c} value={c} className="bg-[#0b1528]">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition placeholder-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Content *</label>
                <textarea required rows={8} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all">
                  {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
