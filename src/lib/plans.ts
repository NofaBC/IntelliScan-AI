import { PlanConfig, PlanTier } from "@/types";

export const PLANS: Record<PlanTier, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    tagline: "Try it once",
    websiteLimit: 1,
    scanFrequency: "monthly",
    features: [
      "1 website",
      "1 manual scan per month",
      "Basic AI Opportunity Report",
    ],
    cta: "Start Free",
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: 19,
    tagline: "For solo business owners",
    websiteLimit: 1,
    scanFrequency: "monthly",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    features: [
      "1 website",
      "Monthly automated scan",
      "Saved report history",
      "PDF download",
      "Basic recommendations",
      '"Build This for Me" option',
    ],
    cta: "Get Started",
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 49,
    tagline: "Best for active small businesses",
    websiteLimit: 3,
    scanFrequency: "biweekly",
    highlighted: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    features: [
      "Up to 3 websites",
      "Bi-weekly automated scans",
      "Manual scans included",
      "Change detection",
      "Saved scan history",
      "PDF export",
      "Priority recommendations",
      "Opportunity alerts",
    ],
    cta: "Go Pro",
  },
  agency: {
    id: "agency",
    name: "Agency",
    price: 249,
    tagline: "For consultants & agencies",
    websiteLimit: 30,
    scanFrequency: "weekly",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY,
    features: [
      "Up to 30 websites",
      "Weekly automated scans",
      "Client-ready PDF reports",
      "Multi-client dashboard",
      "Export & share reports",
      "Agency branding",
      "Lead opportunity tracking",
      "Priority support",
    ],
    cta: "Start Agency Plan",
  },
};

export const PUBLIC_PLANS: PlanTier[] = ["starter", "pro", "agency"];

export function getPlanLimits(plan: PlanTier) {
  const config = PLANS[plan];
  return {
    websiteLimit: config.websiteLimit,
    scanFrequency: config.scanFrequency,
    canExportPdf: plan !== "free",
    hasSavedHistory: plan !== "free",
    hasManualScan: true,
    hasAutomatedScan: plan !== "free",
  };
}

export function getNextScanDate(frequency: string, from: Date = new Date()): Date {
  const next = new Date(from);
  switch (frequency) {
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "biweekly":
      next.setDate(next.getDate() + 14);
      break;
    case "monthly":
    default:
      next.setMonth(next.getMonth() + 1);
      break;
  }
  return next;
}
