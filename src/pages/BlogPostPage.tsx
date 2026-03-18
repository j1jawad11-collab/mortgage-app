import { useParams, Link, Navigate } from 'react-router-dom'
import { blogPosts } from '@/data/blogPosts'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  // Very simple text rendering: split by double newline for paragraphs
  const renderContent = (text: string) => {
    return text.trim().split('\n\n').map((paragraph, idx) => {
      // Very crude bold parsing for **text**
      const boldParsed = paragraph.split(/(\*\*.*?\*\*)/).map((segment, sIdx) => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return <strong key={sIdx} className="font-bold text-slate-900">{segment.slice(2, -2)}</strong>
        }
        return segment
      })

      return (
        <p key={idx} className="mb-6 text-slate-700 leading-relaxed text-lg">
          {boldParsed}
        </p>
      )
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <nav className="mb-8">
          <Link to="/blog" className="text-primary-600 font-semibold hover:underline inline-flex items-center gap-2">
            ← Back to Blog
          </Link>
        </nav>

        <article className="bg-white rounded-2xl shadow-card p-6 sm:p-10 border border-slate-100">
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4 text-sm font-semibold">
              <span className="text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">{post.category}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{post.readTime}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{post.date}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              {post.title}
            </h1>
          </header>

          <figure className="mb-10 rounded-xl overflow-hidden shadow-lg border border-slate-100">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto max-h-[450px] object-cover"
            />
          </figure>

          <div className="prose prose-slate max-w-none">
            {renderContent(post.content)}
          </div>
        </article>
      </div>
    </div>
  )
}
