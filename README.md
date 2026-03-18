# Delta Mortgage — Production-Ready React App

A full-featured mortgage broker web app built with React, TypeScript, TailwindCSS, React Query, Recharts, and React Hook Form. Modelled on [deltaf.ca](https://deltaf.ca) with enhanced UX.

## 🚀 Quick Start

```bash
# Clone / enter project
cd path/to/delta-mortgage

# Install dependencies
npm install
# or
pnpm install

# Start dev server (http://localhost:5173)
npm run dev
```

## 📋 Pages & Routes

| Route | Page |
|-------|------|
| `/` | Home — hero, rates preview, services, testimonials |
| `/mortgage-calculator` | Full mortgage calculator with amortization chart |
| `/refinance-calculator` | Refinance savings & break-even calculator |
| `/affordability-calculator` | Max home price using GDS/TDS stress test |
| `/rates` | Live rate cards with filter/sort |
| `/contact` | Contact form with validation |
| `*` | Custom 404 page |

## 🛠 Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + production build
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run format       # Prettier format src/**
npm run type-check   # TypeScript type check (no emit)
npm run test         # Run all Vitest unit tests
npm run test:watch   # Vitest in watch mode
npm run test:coverage # Coverage report
```

## 🧪 Tests

```bash
npm run test
```

Tests live in:
- `src/utils/__tests__/mortgageCalc.test.ts` — ~10 tests
- `src/utils/__tests__/refinanceCalc.test.ts` — ~6 tests  
- `src/utils/__tests__/affordabilityCalc.test.ts` — ~10 tests
- `src/utils/__tests__/formatters.test.ts` — ~12 tests
- `src/components/__tests__/NumberDisplay.test.tsx` — ~4 tests

## 🏗 Project Structure

```
src/
├── components/
│   ├── ui/          # Button, Input, Slider, Card, NumberDisplay,
│   │                #  ChartCard, RateCard, Badge, Select, Modal, Toast
│   └── layout/      # SiteHeader, Footer, Layout
├── data/            # rates.json (mock), seedLocalStorage.ts
├── hooks/           # useRates.ts (React Query)
├── pages/           # All 7 page components
├── types/           # mortgage.ts (all TypeScript interfaces)
├── utils/           # mortgageCalc.ts, refinanceCalc.ts,
│                    #  affordabilityCalc.ts, formatters.ts
└── test/            # setup.ts
```

## 🔌 Swap in a Real Rates API

Edit `src/hooks/useRates.ts` — replace the mock fetch body with:

```ts
const res = await fetch('https://api.deltamortgage.ca/v1/rates')
if (!res.ok) throw new Error('Failed to fetch rates')
return res.json() as Promise<Rate[]>
```

## 🌐 Deploy

### Vercel (recommended)

```bash
npm run build
# Push to GitHub, connect repo to vercel.com
# Zero config — vercel.json handles SPA routing
```

### Netlify

```bash
npm run build
# Push to GitHub, connect to netlify.com
# netlify.toml handles _redirects for SPA routing
```

### Manual Docker / Static Host

```bash
npm run build
# Serve the dist/ folder with any static server
# Ensure all paths redirect to index.html for client-side routing
```

## 🎨 Design Tokens

Configured in `src/index.css` (`@theme` block, Tailwind v4):

| Token | Value |
|-------|-------|
| `--color-primary-600` | `#0d9488` (teal) |
| `--color-navy-800` | `#1e3a5f` (dark navy) |
| `--font-sans` | Poppins |
| `--font-display` | DM Serif Display |

## ✅ Implementation Checklist

- [x] Mortgage calculator (Canadian semi-annual compounding)
- [x] Refinance calculator (break-even, savings)
- [x] Affordability calculator (GDS/TDS stress test, OSFI B-20)
- [x] Live slider + number inputs with animated transitions
- [x] Recharts: AreaChart, PieChart, BarChart, RadialBarChart
- [x] Rates page with filter/sort + skeleton loading
- [x] Contact form — React Hook Form + Zod + honeypot
- [x] Sticky header with dropdown nav + mobile hamburger
- [x] React Query caching (5 min staleTime)
- [x] Unit tests for all calculator logic
- [x] TypeScript strict mode
- [x] Responsive (mobile-first)
- [x] Accessible (ARIA labels, keyboard nav, semantic HTML)
- [x] Vercel + Netlify deploy config

## ⚠️ What Needs Manual Polish

- **Images**: No real photography; replace hero background with a stock photo of a home
- **FSRA license**: Update `#13773` to your actual number
- **Google Analytics / tracking**: Add your GA4 measurement ID to `index.html`
- **Email backend**: `ContactPage.tsx` currently logs to console — integrate with EmailJS, Resend, or your own API
- **Legal pages**: Add Terms of Service, Privacy Policy routes
- **Meta/OG tags**: Fill in real descriptions and social preview images in `index.html`
