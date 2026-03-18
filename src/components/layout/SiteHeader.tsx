import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  {
    label: 'Calculators',
    children: [
      { to: '/mortgage-calculator', label: 'Mortgage Calculator' },
      { to: '/refinance-calculator', label: 'Refinance Calculator' },
      { to: '/affordability-calculator', label: 'Affordability Calculator' },
    ],
  },
  { to: '/rates', label: 'Rates' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b1528]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/[0.06]'
          : 'bg-[#0b1528] border-b border-white/[0.08]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px]">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="Delta Mortgage Home">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-[0_0_16px_rgba(13,148,136,0.45)] group-hover:shadow-[0_0_24px_rgba(13,148,136,0.65)] transition-all duration-300">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
              <path d="M12 3L22 20H2L12 3Z" fill="white" fillOpacity="0.95" />
              <path d="M12 8L18 18H6L12 8Z" fill="rgba(255,255,255,0.22)" />
            </svg>
          </div>
          <div className="leading-tight">
            <span className="block text-[17px] font-extrabold text-white tracking-tight leading-none">
              Delta Mortgage
            </span>
            <span className="block text-[11px] font-semibold text-primary-400 tracking-wider mt-0.5 uppercase">
              FSRA Lic. #13773
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
          {navLinks.map((link) => {
            if ('children' in link) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setCalcOpen(true)}
                  onMouseLeave={() => setCalcOpen(false)}
                >
                  <button
                    onClick={() => setCalcOpen(!calcOpen)}
                    aria-expanded={calcOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold text-slate-200 hover:text-white hover:bg-white/8 rounded-lg transition-all duration-200"
                  >
                    {link.label}
                    <svg
                      width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth={2.5}
                      className={`transition-transform duration-200 ${calcOpen ? 'rotate-180 text-primary-400' : 'text-slate-400'}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {calcOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 z-50">
                      <div className="bg-[#111e35] backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 p-1.5 overflow-hidden">
                        {link.children?.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            onClick={() => setCalcOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-4 py-3 text-[14px] font-semibold rounded-xl transition-all duration-200 ${
                                isActive
                                  ? 'text-primary-300 bg-primary-500/15'
                                  : 'text-slate-200 hover:bg-white/8 hover:text-white'
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }
            return (
              <NavLink
                key={link.to}
                to={link.to!}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-[13.5px] font-semibold rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-slate-200 hover:text-white hover:bg-white/8'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* ── CTA + Hamburger ── */}
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-[13.5px] font-bold rounded-xl shadow-[0_0_20px_rgba(13,148,136,0.35)] hover:shadow-[0_0_28px_rgba(13,148,136,0.55)] transition-all duration-300 active:scale-95"
          >
            Get Pre-Approved
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                  <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.07] bg-[#0d1a2e] px-4 py-3 flex flex-col gap-1">
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/services', label: 'Services' },
          ].map((l) => (
            <NavLink
              key={l.to} to={l.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 text-[14px] font-semibold rounded-xl transition-colors ${
                  isActive ? 'text-primary-300 bg-white/8' : 'text-slate-200 hover:text-white hover:bg-white/6'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <p className="px-4 pt-3 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            Calculators
          </p>
          {navLinks[3].children?.map((c) => (
            <NavLink
              key={c.to} to={c.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 text-[14px] font-semibold rounded-xl transition-colors ${
                  isActive ? 'text-primary-300 bg-white/8' : 'text-slate-200 hover:text-white hover:bg-white/6'
                }`
              }
            >
              {c.label}
            </NavLink>
          ))}

          {[
            { to: '/rates', label: 'Rates' },
            { to: '/blog', label: 'Blog' },
            { to: '/contact', label: 'Contact' },
          ].map((l) => (
            <NavLink
              key={l.to} to={l.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 text-[14px] font-semibold rounded-xl transition-colors ${
                  isActive ? 'text-primary-300 bg-white/8' : 'text-slate-200 hover:text-white hover:bg-white/6'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <div className="px-2 pt-3 pb-1">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold text-[14px] rounded-xl shadow-[0_0_18px_rgba(13,148,136,0.35)] transition-all"
            >
              Get Pre-Approved
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
