import dbConnect from './_lib/dbConnect.js'
import { verifyAdminToken } from './_lib/auth.js'

// ── Default content (mirrors src/content/siteContent.ts) ──────────────────────
// Kept in plain JS so this serverless function has no Vite/TS dependency.
const defaults = {
  home: {
    hero: {
      badge: "Canada's Trusted Mortgage Broker",
      titleStart: 'Unlocking ',
      titleHighlight: 'Dreams,',
      titleEnd: 'One Mortgage\nat a Time',
      description:
        "Save thousands with access to 50+ lenders, expert guidance, and rates you won't find at the branch. Your dream home is closer than you think.",
      ctaPrimary: "Apply Now — It's Free",
      ctaSecondary: 'Try Calculator',
    },
    heroCalculator: {
      title: 'Quick Estimate',
      labels: {
        price: 'Home Price',
        rate: 'Rate (%)',
        amortization: 'Amortization',
        monthly: 'Est. Monthly Payment',
      },
      footer: '20% down · {years} yr amortization',
      buttonText: 'Full Calculator →',
    },
    rates: {
      title: "Today's Best Rates",
      subtitle: 'Updated March 2026 · Subject to qualification',
      linkText: 'View All Rates →',
      tableHeaders: ['Term', 'Rate', 'Est. Monthly ($600K)', ''],
      buttonText: 'Apply →',
      previewRates: [
        { term: '5 Year Fixed', rate: 4.69, lender: 'Best Available' },
        { term: '5 Year Variable', rate: 4.30, lender: 'Best Available' },
        { term: '3 Year Fixed', rate: 4.74, lender: 'Best Available' },
        { term: '2 Year Variable', rate: 4.20, lender: 'Best Available' },
      ],
    },
    services: {
      title: 'Mortgage Solutions for Every Situation',
      subtitle:
        "Whether you're buying, renewing, or refinancing — we have the right solution and the right lender for you.",
      list: [
        { icon: '🏡', title: 'First-Time Buyers', desc: 'Navigate your first home purchase with confidence. We guide you through every step, from pre-approval to closing.', link: '/contact' },
        { icon: '🔄', title: 'Mortgage Refinance', desc: 'Lower your rate, access equity, or consolidate debt. Find out if refinancing makes financial sense for you.', link: '/refinance-calculator' },
        { icon: '📋', title: 'Mortgage Renewal', desc: "Don't just auto-renew. Shop the market at renewal and potentially save thousands over your next term.", link: '/rates' },
        { icon: '🏢', title: 'Investment Properties', desc: 'Grow your real estate portfolio with tailored financing solutions for rental and investment properties.', link: '/contact' },
        { icon: '💳', title: 'Bad Credit Solutions', desc: 'We work with alternative lenders to find mortgage solutions even when the banks say no.', link: '/contact' },
        { icon: '🏗️', title: 'Construction Loans', desc: 'Building your dream home? Specialized construction financing to fund your build from the ground up.', link: '/contact' },
      ],
      linkText: 'Learn more',
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Get your best mortgage in three simple steps — from application to approval.',
      cta: 'Get Started Today',
      steps: [
        { num: '01', title: 'Apply in Minutes', desc: 'Fill out our simple online application. No paperwork, no branch visits required.' },
        { num: '02', title: 'We Shop the Market', desc: 'We compare rates from 50+ lenders to find you the best deal available today.' },
        { num: '03', title: 'Close With Confidence', desc: "Our brokers guide you through approval and closing. You're never alone in the process." },
      ],
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: "Join hundreds of Canadians who've found their best mortgage with Delta.",
      list: [
        { name: 'Sarah & James M.', role: 'First-time Homebuyers, Brampton ON', text: 'We were overwhelmed by the process, but Delta Mortgage made it seamless. They saved us over $12,000 in interest by finding a rate we never thought we could qualify for.', stars: 5 },
        { name: 'Michael T.', role: 'Investment Property Investor', text: "I've closed three investment properties with Delta. Their expertise and speed of approval is unmatched. My go-to broker for everything real estate.", stars: 5 },
        { name: 'Priya K.', role: 'Refinance Client, Mississauga ON', text: 'Refinanced my mortgage in under two weeks. The team was responsive, transparent about all costs, and the savings spoke for themselves.', stars: 5 },
      ],
    },
    stats: [
      { value: '500+', label: 'Happy Clients' },
      { value: '50+', label: 'Lender Partners' },
      { value: '$200M+', label: 'Mortgages Funded' },
      { value: '4.9★', label: 'Average Rating' },
    ],
    ctaBanner: {
      title: 'Ready to Find Your Best Mortgage?',
      subtitle: 'Get a free consultation with one of our expert mortgage brokers today. No obligation, just expert advice.',
      buttonPrimary: 'Book Free Consultation',
      buttonSecondary: 'Calculate My Payment',
    },
  },

  services: {
    hero: {
      titleStart: 'Our ',
      titleHighlight: 'Services',
      description:
        "Whether you're buying your first home or building a real estate empire, we have tailored mortgage solutions to fit your unique financial situation.",
    },
    list: [
      { title: 'First-Time Home Buyers', iconPath: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25', description: 'Navigate the complex world of buying your first home with expert guidance. We help you understand incentives, down payments, and get pre-approved quickly.', link: '/contact' },
      { title: 'Mortgage Renewals', iconPath: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99', description: "Don't just sign your lender's renewal letter. Let us shop the market to find you a better rate and save thousands over your next term.", link: '/rates' },
      { title: 'Refinancing', iconPath: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', description: 'Unlock home equity for renovations, debt consolidation, or investments. We break down the penalties and calculate your true break-even point.', link: '/refinance-calculator' },
      { title: 'Investment Properties', iconPath: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941', description: 'Build your wealth through real estate. We structure mortgages for single rentals and multi-unit residential properties to maximize your cash flow.', link: '/contact' },
      { title: 'New to Canada', iconPath: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z', description: 'Specialized programs designed for newcomers without an established Canadian credit history. Turn your new life into a new home.', link: '/contact' },
      { title: 'Self-Employed Mortgages', iconPath: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z', description: 'We work with alt-A lenders who understand business income. We help you qualify based on your business cash flow, not just your personal tax returns.', link: '/contact' },
    ],
    buttonText: 'Learn More',
    process: {
      title: 'Our Simple 4-Step Process',
      steps: [
        { step: '01', title: 'Apply', desc: 'Fill out our secure online application in under 5 minutes.' },
        { step: '02', title: 'Consult', desc: 'We review your profile and discuss your goals.' },
        { step: '03', title: 'Approval', desc: 'We secure the best rate from our network of 50+ lenders.' },
        { step: '04', title: 'Close', desc: 'Sign the papers and get the keys to your new home.' },
      ],
    },
  },
}

// ── Handler ────────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // ── CORS: allow same-origin + Vercel preview URLs ─────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  // ── DB connection ──────────────────────────────────────────────────────────
  let mongoose
  try {
    mongoose = await dbConnect()
  } catch (err) {
    console.error('[pages] DB connect failed:', err)
    return res.status(503).json({ error: 'Database connection failed' })
  }

  const db = mongoose.connection.getClient().db('mortgageDB')
  const pages = db.collection('pages')

  // ── GET /api/pages?page=<key> ──────────────────────────────────────────────
  if (req.method === 'GET') {
    const { page } = req.query

    if (!page || typeof page !== 'string') {
      return res.status(400).json({ error: 'Missing required query param: page' })
    }

    if (!defaults[page]) {
      return res.status(404).json({ error: `Unknown page key: "${page}"` })
    }

    try {
      let doc = await pages.findOne({ _id: page })

      // Auto-seed: if document doesn't exist, insert the static defaults and return them.
      if (!doc) {
        console.log(`[pages] Seeding default content for page: "${page}"`)
        const seedDoc = { _id: page, content: defaults[page], updatedAt: new Date() }
        await pages.insertOne(seedDoc)
        doc = seedDoc
      }

      return res.status(200).json({ page, content: doc.content })
    } catch (err) {
      console.error(`[pages] GET failed for page "${page}":`, err)
      return res.status(500).json({ error: 'Failed to fetch page content' })
    }
  }

  // ── PUT /api/pages — requires admin JWT ────────────────────────────────────
  if (req.method === 'PUT') {
    try {
      verifyAdminToken(req)
    } catch (err) {
      return res.status(401).json({ error: err.message })
    }

    const { page, content } = req.body ?? {}

    if (!page || typeof page !== 'string') {
      return res.status(400).json({ error: 'Missing required field: page' })
    }

    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Missing required field: content (must be an object)' })
    }

    if (!defaults[page]) {
      return res.status(404).json({ error: `Unknown page key: "${page}"` })
    }

    try {
      await pages.updateOne(
        { _id: page },
        { $set: { content, updatedAt: new Date() } },
        { upsert: true }, // creates the doc if it was never seeded via GET
      )

      return res.status(200).json({ success: true, page })
    } catch (err) {
      console.error(`[pages] PUT failed for page "${page}":`, err)
      return res.status(500).json({ error: 'Failed to update page content' })
    }
  }

  // ── Method not allowed ─────────────────────────────────────────────────────
  return res.status(405).json({ error: `Method "${req.method}" not allowed` })
}
