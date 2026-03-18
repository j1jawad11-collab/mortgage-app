import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#08111f] text-slate-300 mt-auto relative overflow-hidden" role="contentinfo">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-primary-500/8 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
      {/* Top gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* ── Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(13,148,136,0.4)] group-hover:shadow-[0_0_30px_rgba(13,148,136,0.6)] transition-all duration-300">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
                  <path d="M12 3L22 20H2L12 3Z" fill="white" fillOpacity="0.95" />
                  <path d="M12 8L18 18H6L12 8Z" fill="rgba(255,255,255,0.22)" />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="block text-[18px] font-extrabold text-white tracking-tight leading-none">
                  Delta Mortgage
                </span>
                <span className="block text-[11px] font-semibold text-primary-400 tracking-wider mt-0.5 uppercase">
                  FSRA Lic. #13773
                </span>
              </div>
            </Link>

            <p className="text-[14px] text-slate-400 leading-relaxed max-w-[250px]">
              Helping Canadians unlock their dream homes with competitive rates, expert advice, and seamless mortgage solutions.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-6">
              {[
                { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a2 2 0 002-2v-11a2 2 0 00-2-2h-11a2 2 0 00-2 2v11a2 2 0 002 2z' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-10 h-10 bg-white/8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 hover:shadow-[0_0_14px_rgba(13,148,136,0.4)] transition-all duration-300"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ── Company Links ── */}
          <div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-[0.12em] mb-5">Company</h3>
            <ul className="flex flex-col gap-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/services', label: 'Our Services' },
                { to: '/rates', label: 'Current Rates' },
                { to: '/blog', label: 'Latest News' },
                { to: '/contact', label: 'Contact Us' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[14px] text-slate-400 hover:text-primary-300 transition-colors duration-200 font-medium inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/40 group-hover:bg-primary-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Calculators ── */}
          <div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-[0.12em] mb-5">Calculators</h3>
            <ul className="flex flex-col gap-3">
              {[
                { to: '/mortgage-calculator', label: 'Mortgage Calculator' },
                { to: '/refinance-calculator', label: 'Refinance Calculator' },
                { to: '/affordability-calculator', label: 'Affordability Check' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[14px] text-slate-400 hover:text-primary-300 transition-colors duration-200 font-medium inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/40 group-hover:bg-primary-400 transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-[13px] font-black text-white uppercase tracking-[0.12em] mb-5">Contact</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span className="text-[14px] text-slate-400 leading-snug">10 Kingsbridge Garden Circle,<br />Brampton, ON</span>
              </li>
              <li className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <a href="tel:+16478601838" className="text-[14px] text-slate-400 hover:text-primary-300 font-medium transition-colors">
                  (647) 860-1838
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <a href="mailto:info@deltaf.ca" className="text-[14px] text-slate-400 hover:text-primary-300 font-medium transition-colors">
                  info@deltaf.ca
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/8 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-slate-500 font-medium">
            © {year} <span className="text-slate-400">Delta Mortgage Inc.</span> All rights reserved. FSRA Lic. #13773
          </p>
          <p className="text-[12px] text-slate-600 text-center sm:text-right">
            Rates are for informational purposes only and subject to change without notice.
          </p>
        </div>
      </div>
    </footer>
  )
}
