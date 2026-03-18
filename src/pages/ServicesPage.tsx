import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { content } from '@/content/siteContent'

export function ServicesPage() {
  const c = content.services

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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {c.list.map((service, index) => (
            <Card key={index} className="p-8 hover:shadow-card-hover transition-all duration-300 flex flex-col h-full border-t-4 border-t-primary-500">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  {service.iconPath.split(' M').map((pathPart, idx) => (
                    <path key={idx} strokeLinecap="round" strokeLinejoin="round" d={idx === 0 ? pathPart : `M${pathPart}`} />
                  ))}
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>
              <Link to={service.link} className="text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-2 group mt-auto inline-flex">
                {c.buttonText}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-navy-900 rounded-3xl p-10 md:p-14 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <h2 className="text-3xl font-bold mb-10 text-center relative z-10">{c.process.title}</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {c.process.steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 text-primary-300 font-bold text-xl">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

