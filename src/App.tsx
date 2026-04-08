import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { MortgageCalculatorPage } from '@/pages/MortgageCalculatorPage'
import { RefinanceCalculatorPage } from '@/pages/RefinanceCalculatorPage'
import { AffordabilityCalculatorPage } from '@/pages/AffordabilityCalculatorPage'
import { RatesPage } from '@/pages/RatesPage'
import { ContactPage } from '@/pages/ContactPage'
import { AboutPage } from '@/pages/AboutPage'
import { ServicesPage } from '@/pages/ServicesPage'
import { BlogPage } from '@/pages/BlogPage'
import { BlogPostPage } from '@/pages/BlogPostPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AuthProvider } from '@/context/AuthContext'
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminPostsPage } from '@/pages/admin/AdminPostsPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site routes */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="mortgage-calculator" element={<MortgageCalculatorPage />} />
              <Route path="refinance-calculator" element={<RefinanceCalculatorPage />} />
              <Route path="affordability-calculator" element={<AffordabilityCalculatorPage />} />
              <Route path="rates" element={<RatesPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route
              path="admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="posts" element={<AdminPostsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
