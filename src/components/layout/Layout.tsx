import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'

export function Layout() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1 flex flex-col pt-16">
        <PageTransition />
      </main>
      <Footer />
    </div>
  )
}
