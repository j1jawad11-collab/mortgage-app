import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { content as defaults } from '@/content/siteContent'
import {
  Loader2, CheckCircle2, AlertCircle, ChevronDown,
  Globe, Briefcase
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = 'home' | 'services'
type HomeContent = typeof defaults.home
type ServicesContent = typeof defaults.services

// ── Shared field components ────────────────────────────────────────────────────
const inputCls =
  'w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-inner placeholder-slate-600'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
      {children}
    </label>
  )
}

function Field({
  label, value, onChange, textarea = false, placeholder = '', rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}

// Collapsible section card
function Section({ title, badge, defaultOpen = true, children }: {
  title: string
  badge?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-[#0b1528]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">{title}</span>
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-6 pb-6 pt-1 space-y-4 border-t border-white/5">{children}</div>}
    </div>
  )
}

// Toast banner
function Toast({ text, type }: { text: string; type: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`px-4 py-3 rounded-xl text-sm border flex items-center gap-3 ${
        type === 'success'
          ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.15)]'
          : 'bg-red-500/10 border-red-500/30 text-red-400'
      }`}
    >
      {type === 'success'
        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />}
      {text}
    </motion.div>
  )
}

import { Skeleton } from '@/components/ui/Skeleton'

// Skeleton loader layout
function ContentSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-14" delay={i * 0.15} />
      ))}
    </div>
  )
}

// Save footer bar
function SaveBar({
  saving, msg, onSave,
}: {
  saving: boolean
  msg: { text: string; type: string }
  onSave: () => void
}) {
  return (
    <div className="sticky bottom-0 z-10 bg-[#0a1325]/90 backdrop-blur-xl border-t border-white/5 px-0 py-4 flex items-center justify-between gap-4 mt-2">
      <div className="flex-1">
        <AnimatePresence mode="popLayout">
          {msg.text && <Toast key={msg.text} text={msg.text} type={msg.type} />}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white font-semibold py-2.5 px-7 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-95 whitespace-nowrap"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export function AdminContentPage() {
  const { token } = useAuth()
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('home')

  // ── Local draft state ────────────────────────────────────────────────────────
  const [home, setHome] = useState<HomeContent>(() => structuredClone(defaults.home))
  const [homeMsg, setHomeMsg] = useState({ text: '', type: '' })
  const [homeSaving, setHomeSaving] = useState(false)

  const [services, setServices] = useState<ServicesContent>(() => structuredClone(defaults.services))
  const [servicesMsg, setServicesMsg] = useState({ text: '', type: '' })
  const [servicesSaving, setServicesSaving] = useState(false)

  // ── Fetch live content (staleTime 0 → always fresh in admin) ─────────────────
  const { data: homeData, isLoading: homeLoading } = useQuery<HomeContent>({
    queryKey: ['page-content', 'home'],
    queryFn: async () => {
      const r = await fetch('/api/pages?page=home')
      if (!r.ok) throw new Error('Failed to fetch homepage content')
      return (await r.json()).content
    },
    staleTime: 0,
  })

  const { data: servicesData, isLoading: servicesLoading } = useQuery<ServicesContent>({
    queryKey: ['page-content', 'services'],
    queryFn: async () => {
      const r = await fetch('/api/pages?page=services')
      if (!r.ok) throw new Error('Failed to fetch services content')
      return (await r.json()).content
    },
    staleTime: 0,
  })

  // Seed local draft state from DB once loaded
  useEffect(() => { if (homeData) setHome(structuredClone(homeData)) }, [homeData])
  useEffect(() => { if (servicesData) setServices(structuredClone(servicesData)) }, [servicesData])

  // ── Save handlers ────────────────────────────────────────────────────────────
  const saveHome = async () => {
    setHomeSaving(true)
    setHomeMsg({ text: '', type: '' })
    try {
      const r = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ page: 'home', content: home }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Save failed')
      await qc.invalidateQueries({ queryKey: ['page-content', 'home'] })
      setHomeMsg({ text: 'Homepage content saved successfully!', type: 'success' })
    } catch (e: any) {
      setHomeMsg({ text: e.message, type: 'error' })
    } finally {
      setHomeSaving(false)
    }
  }

  const saveServices = async () => {
    setServicesSaving(true)
    setServicesMsg({ text: '', type: '' })
    try {
      const r = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ page: 'services', content: services }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Save failed')
      await qc.invalidateQueries({ queryKey: ['page-content', 'services'] })
      setServicesMsg({ text: 'Services content saved successfully!', type: 'success' })
    } catch (e: any) {
      setServicesMsg({ text: e.message, type: 'error' })
    } finally {
      setServicesSaving(false)
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  // Deep-set helpers for the home draft
  const setHero = (patch: Partial<HomeContent['hero']>) =>
    setHome(p => ({ ...p, hero: { ...p.hero, ...patch } }))

  const setStat = (i: number, patch: Partial<HomeContent['stats'][number]>) =>
    setHome(p => {
      const stats = [...p.stats]
      stats[i] = { ...stats[i], ...patch }
      return { ...p, stats }
    })

  const setHomeService = (i: number, patch: Partial<HomeContent['services']['list'][number]>) =>
    setHome(p => {
      const list = [...p.services.list]
      list[i] = { ...list[i], ...patch }
      return { ...p, services: { ...p.services, list } }
    })

  const setHowStep = (i: number, patch: Partial<HomeContent['howItWorks']['steps'][number]>) =>
    setHome(p => {
      const steps = [...p.howItWorks.steps]
      steps[i] = { ...steps[i], ...patch }
      return { ...p, howItWorks: { ...p.howItWorks, steps } }
    })

  const setServicesListItem = (i: number, patch: Partial<ServicesContent['list'][number]>) =>
    setServices(p => {
      const list = [...p.list]
      list[i] = { ...list[i], ...patch }
      return { ...p, list }
    })

  const setProcessStep = (i: number, patch: Partial<ServicesContent['process']['steps'][number]>) =>
    setServices(p => {
      const steps = [...p.process.steps]
      steps[i] = { ...steps[i], ...patch }
      return { ...p, process: { ...p.process, steps } }
    })

  // ── Render ───────────────────────────────────────────────────────────────────
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'home', label: 'Homepage', icon: Globe },
    { key: 'services', label: 'Services', icon: Briefcase },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Page Content</h1>
        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
          Edit the text and copy shown on your live website. Changes save to MongoDB instantly.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 bg-[#060c18]/60 p-1.5 rounded-xl border border-white/5 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === key
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-inner'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── HOMEPAGE TAB ──────────────────────────────────────────────────── */}
      {tab === 'home' && (
        <div className="space-y-4">
          {homeLoading ? (
            <div className="bg-[#0b1528]/50 border border-white/5 rounded-2xl p-6">
              <ContentSkeleton />
            </div>
          ) : (
            <>
              {/* Hero */}
              <Section title="Hero Section" badge="above the fold">
                <Field
                  label="Badge Text"
                  value={home.hero.badge}
                  onChange={v => setHero({ badge: v })}
                  placeholder="Canada's Trusted Mortgage Broker"
                />
                <Grid2>
                  <Field label="Title — Part 1" value={home.hero.titleStart} onChange={v => setHero({ titleStart: v })} />
                  <Field label="Title — Highlight (teal)" value={home.hero.titleHighlight} onChange={v => setHero({ titleHighlight: v })} />
                </Grid2>
                <Field label="Title — Part 3" value={home.hero.titleEnd} onChange={v => setHero({ titleEnd: v })} placeholder="One Mortgage\nat a Time" />
                <Field
                  label="Description"
                  value={home.hero.description}
                  onChange={v => setHero({ description: v })}
                  textarea
                  rows={3}
                />
                <Grid2>
                  <Field label="Primary CTA Button" value={home.hero.ctaPrimary} onChange={v => setHero({ ctaPrimary: v })} />
                  <Field label="Secondary CTA Button" value={home.hero.ctaSecondary} onChange={v => setHero({ ctaSecondary: v })} />
                </Grid2>
              </Section>

              {/* Stats */}
              <Section title="Stats Strip" badge="4 items">
                <div className="grid grid-cols-2 gap-4">
                  {home.stats.map((s, i) => (
                    <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stat {i + 1}</p>
                      <Grid2>
                        <Field label="Value" value={s.value} onChange={v => setStat(i, { value: v })} placeholder="500+" />
                        <Field label="Label" value={s.label} onChange={v => setStat(i, { label: v })} placeholder="Happy Clients" />
                      </Grid2>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Services section on homepage */}
              <Section title="Services Grid" badge="on homepage" defaultOpen={false}>
                <Grid2>
                  <Field
                    label="Section Title"
                    value={home.services.title}
                    onChange={v => setHome(p => ({ ...p, services: { ...p.services, title: v } }))}
                  />
                  <Field
                    label="Link Text"
                    value={home.services.linkText}
                    onChange={v => setHome(p => ({ ...p, services: { ...p.services, linkText: v } }))}
                  />
                </Grid2>
                <Field
                  label="Section Subtitle"
                  value={home.services.subtitle}
                  onChange={v => setHome(p => ({ ...p, services: { ...p.services, subtitle: v } }))}
                  textarea
                  rows={2}
                />
                <div className="space-y-3">
                  {home.services.list.map((s, i) => (
                    <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {s.icon} Service {i + 1}
                      </p>
                      <Grid2>
                        <Field label="Title" value={s.title} onChange={v => setHomeService(i, { title: v })} />
                        <Field label="Description" value={s.desc} onChange={v => setHomeService(i, { desc: v })} />
                      </Grid2>
                    </div>
                  ))}
                </div>
              </Section>

              {/* How It Works */}
              <Section title="How It Works" defaultOpen={false}>
                <Grid2>
                  <Field
                    label="Section Title"
                    value={home.howItWorks.title}
                    onChange={v => setHome(p => ({ ...p, howItWorks: { ...p.howItWorks, title: v } }))}
                  />
                  <Field
                    label="CTA Button"
                    value={home.howItWorks.cta}
                    onChange={v => setHome(p => ({ ...p, howItWorks: { ...p.howItWorks, cta: v } }))}
                  />
                </Grid2>
                <Field
                  label="Subtitle"
                  value={home.howItWorks.subtitle}
                  onChange={v => setHome(p => ({ ...p, howItWorks: { ...p.howItWorks, subtitle: v } }))}
                  textarea rows={2}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {home.howItWorks.steps.map((s, i) => (
                    <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step {s.num}</p>
                      <Field label="Title" value={s.title} onChange={v => setHowStep(i, { title: v })} />
                      <Field label="Description" value={s.desc} onChange={v => setHowStep(i, { desc: v })} textarea rows={2} />
                    </div>
                  ))}
                </div>
              </Section>

              {/* Testimonials */}
              <Section title="Testimonials" defaultOpen={false}>
                <Grid2>
                  <Field
                    label="Section Title"
                    value={home.testimonials.title}
                    onChange={v => setHome(p => ({ ...p, testimonials: { ...p.testimonials, title: v } }))}
                  />
                  <Field
                    label="Section Subtitle"
                    value={home.testimonials.subtitle}
                    onChange={v => setHome(p => ({ ...p, testimonials: { ...p.testimonials, subtitle: v } }))}
                  />
                </Grid2>
              </Section>

              {/* CTA Banner */}
              <Section title="CTA Banner" badge="bottom of page" defaultOpen={false}>
                <Field
                  label="Headline"
                  value={home.ctaBanner.title}
                  onChange={v => setHome(p => ({ ...p, ctaBanner: { ...p.ctaBanner, title: v } }))}
                />
                <Field
                  label="Subtitle"
                  value={home.ctaBanner.subtitle}
                  onChange={v => setHome(p => ({ ...p, ctaBanner: { ...p.ctaBanner, subtitle: v } }))}
                  textarea rows={2}
                />
                <Grid2>
                  <Field label="Primary Button" value={home.ctaBanner.buttonPrimary} onChange={v => setHome(p => ({ ...p, ctaBanner: { ...p.ctaBanner, buttonPrimary: v } }))} />
                  <Field label="Secondary Button" value={home.ctaBanner.buttonSecondary} onChange={v => setHome(p => ({ ...p, ctaBanner: { ...p.ctaBanner, buttonSecondary: v } }))} />
                </Grid2>
              </Section>
            </>
          )}

          <SaveBar saving={homeSaving} msg={homeMsg} onSave={saveHome} />
        </div>
      )}

      {/* ── SERVICES TAB ──────────────────────────────────────────────────── */}
      {tab === 'services' && (
        <div className="space-y-4">
          {servicesLoading ? (
            <div className="bg-[#0b1528]/50 border border-white/5 rounded-2xl p-6">
              <ContentSkeleton />
            </div>
          ) : (
            <>
              {/* Services Hero */}
              <Section title="Hero Section" badge="page header">
                <Grid2>
                  <Field
                    label="Title — Part 1"
                    value={services.hero.titleStart}
                    onChange={v => setServices(p => ({ ...p, hero: { ...p.hero, titleStart: v } }))}
                  />
                  <Field
                    label="Title — Highlight (teal)"
                    value={services.hero.titleHighlight}
                    onChange={v => setServices(p => ({ ...p, hero: { ...p.hero, titleHighlight: v } }))}
                  />
                </Grid2>
                <Field
                  label="Description"
                  value={services.hero.description}
                  onChange={v => setServices(p => ({ ...p, hero: { ...p.hero, description: v } }))}
                  textarea rows={3}
                />
              </Section>

              {/* Services list */}
              <Section title="Services Cards" badge="6 items">
                <Field
                  label="Card Link Button Text"
                  value={services.buttonText}
                  onChange={v => setServices(p => ({ ...p, buttonText: v }))}
                />
                <div className="space-y-3 pt-1">
                  {services.list.map((s, i) => (
                    <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Service {i + 1}
                      </p>
                      <Field label="Title" value={s.title} onChange={v => setServicesListItem(i, { title: v })} />
                      <Field
                        label="Description"
                        value={s.description}
                        onChange={v => setServicesListItem(i, { description: v })}
                        textarea rows={2}
                      />
                    </div>
                  ))}
                </div>
              </Section>

              {/* Process */}
              <Section title="4-Step Process" defaultOpen={false}>
                <Field
                  label="Section Title"
                  value={services.process.title}
                  onChange={v => setServices(p => ({ ...p, process: { ...p.process, title: v } }))}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {services.process.steps.map((s, i) => (
                    <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Step {s.step}
                      </p>
                      <Field label="Title" value={s.title} onChange={v => setProcessStep(i, { title: v })} />
                      <Field label="Description" value={s.desc} onChange={v => setProcessStep(i, { desc: v })} textarea rows={2} />
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          <SaveBar saving={servicesSaving} msg={servicesMsg} onSave={saveServices} />
        </div>
      )}
    </div>
  )
}
