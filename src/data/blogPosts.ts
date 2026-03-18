export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: string
  imageUrl: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'fixed-vs-variable-rates-2026',
    title: 'Fixed vs. Variable Rates: What to Choose in 2026',
    excerpt: 'With recent Bank of Canada rate announcements, many buyers are torn between the safety of fixed rates and the potential savings of variable rates.',
    content: `When it comes to choosing between a fixed and variable rate mortgage, there is no "one size fits all" answer. The decision heavily depends on your personal risk tolerance, the current economic climate, and your long-term financial goals.

**The Case for Fixed Rates**
A fixed-rate mortgage offers stability and peace of mind. Your interest rate and monthly payment remain the same for the entire term (usually 5 years). In 2026, with inflation stabilization still a topic of debate, many homebuyers are opting to lock in their rates to protect against unexpected interest rate hikes.

**What Should You Choose?**
Consulting with a licensed mortgage broker can help you run the numbers and stress-test both options against your personal financial profile.`,
    category: 'Market Updates',
    date: 'Mar 15, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    slug: 'build-down-payment-faster',
    title: 'How to Build Your Down Payment Faster',
    excerpt: 'Struggling to save 20%? Discover lesser-known strategies, government programs, and RRSP tactics that can accelerate your path to homeownership.',
    content: `Saving for a down payment is often the biggest hurdle for first-time homebuyers. While 20% is the gold standard to avoid mortgage default insurance, you can legally purchase a home in Canada for as little as 5% down (for properties under $500,000).

**1. The First Home Savings Account (FHSA)**
Introduced recently, the FHSA is a game-changer. It combines the best features of an RRSP and a TFSA. Contributions are tax-deductible (like an RRSP), and withdrawals to purchase a first home are tax-free.

**2. Automated Micro-Saving**
Rethink your monthly cash flow. Automate a transfer to a high-interest savings account the day you get paid. Conduct a ruthless audit of your subscriptions.`,
    category: 'First-Time Buyers',
    date: 'Mar 08, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    slug: 'understanding-mortgage-stress-test',
    title: 'Understanding the Mortgage Stress Test',
    excerpt: 'The OSFI stress test determines your maximum affordability. Learn how it works, how it impacts your purchasing power, and ways to improve your ratios.',
    content: `The mortgage stress test is a mandatory qualification hurdle for all federally regulated lenders in Canada. Even if you are offered a mortgage rate of 4.5%, the bank must "stress test" your application to ensure you could still afford payments if rates spiked.

**How it Works**
You must qualify at your contract rate plus 2.0%, or the minimum qualifying rate (currently 5.25%), whichever is higher. 

**How to Beat the Stress Test**
While you can't bypass the rule, you can improve your chances by reducing debt or adding a co-signer.`,
    category: 'Education',
    date: 'Feb 25, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    slug: 'breaking-your-mortgage',
    title: 'When Should You Break Your Mortgage?',
    excerpt: 'Sometimes paying a hefty penalty to refinance into a lower rate actually saves you money. Here is exactly how to run the numbers.',
    content: `Breaking your mortgage early inevitably comes with a prepayment penalty. The real question is whether the interest savings from a lower rate out-weigh that penalty.

**Calculating Break-even**
If your penalty is $4,000, but refinancing saves you $200 a month, your break-even point is 20 months. If you plan to stay in your home past month 20, breaking your mortgage is mathematically the right choice.

Consult your broker to accurately determine what your penalty would be, as Interest Rate Differential penalties at major banks can be punishing.`,
    category: 'Refinancing',
    date: 'Feb 12, 2026',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    slug: 'hidden-costs-buying-home',
    title: 'The Hidden Costs of Buying a Home',
    excerpt: 'Beyond the down payment, there are closing costs, land transfer taxes, and legal fees. Make sure your budget is prepared for these day-one expenses.',
    content: `The sticker price isn't the final price. Buyers must budget an additional 1.5% to 4% of the purchase price for closing costs.

**Major Costs**
1. **Land Transfer Tax:** Municipal and provincial.
2. **Legal Fees:** Typically $1,500 to $2,500.
3. **Appraisal Fees:** Sometimes covered by your lender or broker, but generally $300-$500.

Don't be caught off guard on closing day!`,
    category: 'Education',
    date: 'Jan 30, 2026',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 6,
    slug: 'home-equity-to-invest',
    title: 'Using Your Home Equity to Invest',
    excerpt: 'The Smith Manoeuvre and other strategies allow Canadian homeowners to make their mortgage interest tax-deductible while building an investment portfolio.',
    content: `Your home is more than a place to live; it's a powerful financial tool. By utilizing a readvanceable mortgage (like a HELOC), you can borrow against your equity and invest the funds into income-producing assets.

**Tax Deductibility**
In Canada, if you borrow to invest in assets that generate income (like dividend stocks or rental properties), the interest on that loan becomes tax-deductible against your income.

This strategy requires high risk tolerance and strict discipline, but it accelerates wealth creation exponentially.`,
    category: 'Investing',
    date: 'Jan 15, 2026',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
]
