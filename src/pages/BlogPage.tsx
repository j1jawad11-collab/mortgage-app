import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { content } from '@/content/siteContent'

interface Post {
  _id: string
  slug: string
  title: string
  category: string
  excerpt: string
  content: string
  imageUrl: string
  createdAt: string
}

export function BlogPage() {
  const c = content.blog
  const [activeTab, setActiveTab] = useState('All Articles')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch posts:', err)
        setLoading(false)
      })
  }, [])

  const filteredPosts = activeTab === 'All Articles' 
    ? posts 
    : posts.filter(post => post.category === activeTab)

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 whitespace-pre-line">
            {c.hero.titleStart} <span className="text-primary-600">{c.hero.titleHighlight}</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
            {c.hero.description}
          </p>
        </div>

        {/* Categories (Tabs) */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {c.categories.map((cat) => {
            const isActive = activeTab === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="text-xl font-semibold text-slate-500 animate-pulse">Loading posts...</div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredPosts.length === 0 ? (
              <div className="text-center p-12 text-slate-500 text-lg">
                No articles found matching &quot;{activeTab}&quot;.
              </div>
            ) : (
              /* Blog Grid */
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => {
                   const readTime = Math.ceil(post.content.split(/\s+/).length / 200) + ' min read';
                   const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                   return (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="block group">
                    <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col h-full cursor-pointer">
                      <div className="h-48 overflow-hidden relative">
                        <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-transparent transition-colors z-10" />
                        <img 
                          src={post.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
                          <span className="text-primary-600 uppercase tracking-wider">{post.category}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500">{readTime}</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-sm text-slate-500">{formattedDate}</span>
                          <span className="text-primary-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                            {c.buttonText}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )})}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
