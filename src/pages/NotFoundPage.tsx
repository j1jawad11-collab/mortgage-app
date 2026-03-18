import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Delta triangle illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 teal-gradient rounded-3xl flex items-center justify-center shadow-xl opacity-20" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 80 80" width="80" height="80" fill="none" aria-hidden="true">
                <text x="0" y="60" fontSize="72" fontWeight="900" fill="#0d9488" opacity="0.15">Δ</text>
                <text x="5" y="55" fontSize="60" fontWeight="900" fill="#0d9488">4</text>
                <text x="35" y="55" fontSize="60" fontWeight="900" fill="#0f766e">0</text>
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-slate-800 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-600 mb-4">Page Not Found</h2>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Looks like this page doesn't exist. Perhaps you were looking for a calculator or rate information?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">← Back to Home</Link>
          <Link to="/mortgage-calculator" className="btn-secondary">Try Calculator</Link>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { to: '/mortgage-calculator', label: 'Mortgage Calc' },
            { to: '/rates', label: 'Rates' },
            { to: '/contact', label: 'Contact Us' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
