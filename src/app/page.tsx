"use client";

import Link from "next/link";

const features = [
  {
    icon: "🔍",
    title: "Real Website Analysis",
    desc: "We scan your actual website content — not just your URL — to detect real AI opportunities.",
  },
  {
    icon: "📊",
    title: "Structured Reports",
    desc: "Get categorized recommendations: AI chatbots, lead funnels, email automation, SEO, and more.",
  },
  {
    icon: "🔄",
    title: "Ongoing Monitoring",
    desc: "Automated weekly, bi-weekly, or monthly scans detect new opportunities as your site evolves.",
  },
  {
    icon: "📄",
    title: "PDF Export",
    desc: "Download client-ready PDF reports to share with your team or stakeholders.",
  },
  {
    icon: "🛠️",
    title: "Implementation Options",
    desc: "Each recommendation shows DIY tools, third-party options, and custom-build paths.",
  },
  {
    icon: "🚀",
    title: "Build This for Me",
    desc: "One click to request a custom AI solution from NOFA AI Factory™.",
  },
];

const steps = [
  { num: "1", title: "Add Your Website", desc: "Enter your business URL and create a website profile." },
  { num: "2", title: "Run a Scan", desc: "IntelliScan AI™ analyzes your real website content with AI." },
  { num: "3", title: "Get Your Report", desc: "Receive a structured report with priorities, tools, and next steps." },
  { num: "4", title: "Monitor & Grow", desc: "Automated scans track changes and surface new opportunities." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Your website changes.
            <br />
            Your AI opportunities change too.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-brand-100 max-w-2xl mx-auto">
            IntelliScan AI™ monitors your website, detects automation gaps, and recommends
            AI solutions that reduce workload, improve customer response, and grow revenue.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-brand-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-50 transition-colors"
            >
              Start Free Scan
            </Link>
            <Link
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need to discover AI opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="text-lg font-semibold mt-3">{f.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-bold mx-auto">
                  {s.num}
                </div>
                <h3 className="font-semibold mt-4">{s.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to find hidden AI opportunities?
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
          Join businesses that use IntelliScan AI™ to stay ahead with smart automation.
        </p>
        <Link
          href="/signup"
          className="btn-primary inline-block mt-8 text-lg !px-10 !py-4"
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} IntelliScan AI™ by{" "}
            <a href="https://nofabc.com" className="text-brand-300 hover:underline" target="_blank" rel="noopener noreferrer">
              NOFA AI Factory™
            </a>
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
