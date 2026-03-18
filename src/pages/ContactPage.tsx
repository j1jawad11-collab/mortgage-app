import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Toast, useToast } from '@/components/ui/Toast'
import type { ContactFormData } from '@/types/mortgage'

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(20),
  subject: z.enum(['Purchase', 'Refinance', 'Renewal', 'Investment Property', 'First-Time Buyer', 'Other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine(v => v === true, 'You must agree to be contacted'),
  // honeypot — must remain empty
  website: z.string().max(0, 'Bot detected').optional(),
})

const SUBJECT_OPTIONS = [
  { value: 'Purchase', label: 'Home Purchase' },
  { value: 'Refinance', label: 'Mortgage Refinance' },
  { value: 'Renewal', label: 'Mortgage Renewal' },
  { value: 'Investment Property', label: 'Investment Property' },
  { value: 'First-Time Buyer', label: 'First-Time Buyer' },
  { value: 'Other', label: 'Other' },
]

const INFO_ITEMS = [
  {
    icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
    label: 'Address',
    value: '10 Kingsbridge Garden Circle, Suite 1000, Brampton, ON L6T 3Y6',
  },
  {
    icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
    label: 'Phone',
    value: '(647) 860-1838',
    href: 'tel:+16478601838',
  },
  {
    icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    label: 'Email',
    value: 'info@deltaf.ca',
    href: 'mailto:info@deltaf.ca',
  },
  {
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Hours',
    value: 'Mon–Fri 9am–6pm ET · Sat 10am–4pm ET',
  },
]

export function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData & { website?: string }>({
    resolver: zodResolver(schema),
    defaultValues: { subject: 'Purchase', consent: false },
  })

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check (extra safety)
    if ((data as ContactFormData & { website?: string }).website) return

    // Simulate API submission
    await new Promise(r => setTimeout(r, 1000))

    console.log('Form submitted:', data)
    setIsSubmitted(true)
    showToast('Message sent! We\'ll be in touch within 1 business day.', 'success')
    reset()
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-navy-800 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-3 flex gap-2 items-center">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-200">Contact</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Get in Touch</h1>
          <p className="text-slate-300 mt-2 max-w-xl">Ready to find your best mortgage? Send us a message and we'll respond within 1 business day.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">

          {/* Left: Contact info */}
          <div className="flex flex-col gap-6">
            <div className="card p-6 flex flex-col gap-5">
              <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Contact Information</h2>
              {INFO_ITEMS.map(item => (
                <div key={item.label} className="flex gap-3 items-start">
                  <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" fill="none" stroke="#0d9488" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-sm text-slate-700 hover:text-primary-600 font-medium transition-colors mt-0.5 block">{item.value}</a>
                      : <p className="text-sm text-slate-700 mt-0.5">{item.value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Why choose us */}
            <div className="card p-6 teal-gradient text-white">
              <h3 className="font-bold mb-4">Why Choose Delta Mortgage?</h3>
              {[
                'Access 50+ lenders & exclusive rates',
                'No broker fees — lenders pay us',
                'Fast 24–48hr pre-approvals',
                'Expert advice throughout closing',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 py-1.5 text-sm text-primary-50">
                  <span className="text-primary-200 font-bold">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="card p-8">
            {isSubmitted ? (
              <div className="text-center py-10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-3xl">✅</div>
                <h2 className="text-xl font-bold text-slate-800">Message Received!</h2>
                <p className="text-slate-500 max-w-md">Thank you for reaching out. One of our mortgage experts will contact you within 1 business day.</p>
                <button onClick={() => setIsSubmitted(false)} className="btn-secondary !text-sm mt-2">Send Another Message</button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                aria-label="Contact form"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-6">Send Us a Message</h2>

                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  {...register('website')}
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    placeholder="John Smith"
                    autoComplete="name"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(416) 555-0100"
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Select
                    label="Subject"
                    options={SUBJECT_OPTIONS}
                    error={errors.subject?.message}
                    {...register('subject')}
                  />
                </div>

                <div className="mt-5">
                  <label className="label" htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your mortgage needs — home price, timeline, current situation..."
                    aria-label="Your message"
                    aria-invalid={!!errors.message}
                    className={`input-field resize-none ${errors.message ? '!border-red-400' : ''}`}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p role="alert" className="text-red-500 text-xs font-medium mt-0.5">{errors.message.message}</p>
                  )}
                </div>

                {/* Consent */}
                <div className="mt-5 flex items-start gap-3">
                  <input
                    id="consent"
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    {...register('consent')}
                  />
                  <div>
                    <label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer">
                      I consent to Delta Mortgage contacting me regarding my inquiry. View our{' '}
                      <a href="#" className="text-primary-600 underline hover:text-primary-700">Privacy Policy</a>.
                    </label>
                    {errors.consent && (
                      <p role="alert" className="text-red-500 text-xs font-medium mt-0.5">{errors.consent.message}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  fullWidth
                  className="mt-6"
                  icon={
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  }
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  )
}
