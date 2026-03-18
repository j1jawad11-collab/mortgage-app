import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { content } from '@/content/siteContent'
import { blogPosts } from '@/data/blogPosts'

export function BlogPage() {
  const c = content.blog
  const [activeTab, setActiveTab] = useState('All Articles')

  const filteredPosts = activeTab === 'All Articles' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeTab)

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

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
              <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col h-full cursor-pointer">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
                    <span className="text-primary-600 uppercase tracking-wider">{post.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm text-slate-500">{post.date}</span>
                    <span className="text-primary-600 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                      {c.buttonText}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

