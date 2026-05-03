export type PlanTier = "free" | "starter" | "pro" | "agency";
export type ScanFrequency = "monthly" | "biweekly" | "weekly";
export type WebsiteStatus = "active" | "paused";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: PlanTier;
  createdAt: Date;
  updatedAt: Date;
}

export interface Website {
  id: string;
  userId: string;
  url: string;
  name: string;
  industry?: string;
  scanFrequency: ScanFrequency;
  lastScannedAt?: Date;
  nextScanAt?: Date;
  status: WebsiteStatus;
  createdAt: Date;
}

export interface Recommendation {
  category: string;
  description: string;
  diyTools: string[];
  thirdPartyTools: string[];
  nofaOption: string;
  estimatedTimeSaved: string;
  estimatedRevenueImpact: string;
}

export interface ScanReport {
  id: string;
  websiteId: string;
  userId: string;
  url: string;
  scanDate: Date;
  industry: string;
  businessSnapshot: string;
  strengths: string[];
  missingAutomations: string[];
  recommendations: Recommendation[];
  overallTimeSaved: string;
  overallRevenueOpportunity: string;
  nextRecommendedAction: string;
  createdAt: Date;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  price: number;
  tagline: string;
  websiteLimit: number;
  scanFrequency: ScanFrequency;
  features: string[];
  highlighted?: boolean;
  cta: string;
}
