import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { content } from '@/content/siteContent'

export function AboutPage() {
  const c = content.about

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

        {/* Story & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{c.mission.title}</h2>
            {c.mission.paragraphs.map((p, idx) => (
              <p key={idx} className={`text-slate-600 leading-relaxed ${idx !== c.mission.paragraphs.length - 1 ? 'mb-4' : ''}`}>
                {p}
              </p>
            ))}
          </Card>

          <Card className="p-8 bg-navy-900 border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary-300 mb-6 relative z-10">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 relative z-10">{c.whyChooseUs.title}</h2>
            <ul className="space-y-4 relative z-10">
              {c.whyChooseUs.points.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">{c.team.title}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {c.team.members.map((member) => (
              <Card key={member.name} className="p-6 text-center hover:shadow-card-hover transition-all duration-300">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-md">
                  {member.init}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
                <p className="text-sm text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-slate-500 text-sm">Over 10 years of experience helping Canadians secure their dream homes.</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">{c.cta.title}</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">{c.cta.description}</p>
          <Link to="/contact" className="btn-primary inline-flex">{c.cta.buttonText}</Link>
        </div>
      </div>
    </div>
  )
}

