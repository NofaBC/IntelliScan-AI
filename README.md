# IntelliScan AI™

**AI Opportunity Monitoring System for Business Websites**

IntelliScan AI™ monitors your website, detects automation gaps, and recommends AI solutions that reduce workload, improve customer response, and grow revenue.

## Live Demo

[https://intelli-scan-ai.vercel.app](https://intelli-scan-ai.vercel.app)

## Features

- **User Authentication** — Email/password signup and login via Firebase Auth
- **Website Profiles** — Add and manage multiple business websites
- **Real Website Analysis** — Scrapes actual website content (not just URL guessing)
- **AI-Powered Reports** — Structured opportunity reports via OpenRouter (GPT-4o-mini)
- **Manual & Scheduled Scans** — On-demand scanning plus automated cron-based scans
- **Report History** — All past scans saved and accessible
- **PDF Export** — Download client-ready reports as branded PDFs
- **Pricing Tiers** — Starter ($19/mo), Pro ($49/mo), Agency ($249/mo)
- **"Build This for Me"** — One-click CTA connecting to NOFA AI Factory™

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth & Database**: Firebase Auth + Firestore
- **AI**: OpenRouter API (GPT-4o-mini)
- **Scraping**: Cheerio (server-side HTML parsing)
- **PDF**: jsPDF (client-side generation)
- **Scheduling**: Vercel Cron Jobs
- **Hosting**: Vercel

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/NofaBC/IntelliScan-AI.git
cd IntelliScan-AI
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- **Firebase Client** — Get from Firebase Console > Project Settings
- **Firebase Admin** — Generate a service account key from Firebase Console
- **OpenRouter** — Get your API key from [openrouter.ai](https://openrouter.ai)
- **CRON_SECRET** — Any random string for cron job authentication

### 3. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** with Email/Password provider
3. Create a **Firestore** database
4. Create the following Firestore indexes:
   - `websites`: userId (asc), createdAt (desc)
   - `reports`: userId (asc), scanDate (desc)
   - `reports`: websiteId (asc), userId (asc), scanDate (desc)

### 4. Run Development Server

```bash
npm run dev
```

### 5. Deploy to Vercel

Push to GitHub and connect to Vercel. Add all environment variables in Vercel project settings.

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout with auth
│   ├── login/                      # Login page
│   ├── signup/                     # Signup page
│   ├── pricing/                    # Pricing page
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── websites/               # Website management
│   │   ├── reports/[id]/           # Report viewer + PDF export
│   │   └── settings/               # Account settings
│   └── api/
│       ├── scan/                   # Manual scan endpoint
│       └── cron/scan/              # Automated scan cron endpoint
├── lib/
│   ├── firebase.ts                 # Client SDK config
│   ├── firebase-admin.ts           # Admin SDK for API routes
│   ├── openrouter.ts               # AI analysis via OpenRouter
│   ├── scraper.ts                  # Website content scraper
│   ├── auth-context.tsx            # React auth context
│   └── plans.ts                    # Pricing tier definitions
├── components/
│   ├── Navbar.tsx                  # Navigation bar
│   ├── ReportView.tsx              # Report display component
│   └── BuildThisForMe.tsx          # NOFA AI Factory CTA
└── types/
    └── index.ts                    # TypeScript interfaces
```

## Security

- No API keys exposed in frontend code
- OpenRouter key stored in Vercel environment variables only
- Firebase Admin credentials in server-side environment variables
- All API routes verify Firebase Auth ID tokens
- Firestore security rules enforce user-level data access

## Pricing Tiers

| Plan | Price | Websites | Scan Frequency | Key Features |
|------|-------|----------|----------------|---------------|
| Free | $0/mo | 1 | Manual only | Basic report, no history |
| Starter | $19/mo | 1 | Monthly | History, PDF, recommendations |
| Pro | $49/mo | 3 | Bi-weekly | Change detection, alerts |
| Agency | $249/mo | 30 | Weekly | Multi-client, branding, priority |

## Future (V2)

Architecture supports:
- Stripe subscription billing
- Vendor marketplace
- White-label agency plans
- NOFA Verified AI Builders directory
- Vendor lead routing

## Credits

Built by [Farhad Nasserghodsi](https://www.linkedin.com/in/farhadnasserghodsi) — NOFA AI Factory™

## License

MIT — Free for personal and commercial use. Please credit the original author if reusing.
