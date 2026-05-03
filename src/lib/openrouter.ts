import { ScrapedContent } from "./scraper";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-4o-mini";

export interface AIReport {
  industry: string;
  businessSnapshot: string;
  strengths: string[];
  missingAutomations: string[];
  recommendations: {
    category: string;
    description: string;
    diyTools: string[];
    thirdPartyTools: string[];
    nofaOption: string;
    estimatedTimeSaved: string;
    estimatedRevenueImpact: string;
  }[];
  overallTimeSaved: string;
  overallRevenueOpportunity: string;
  nextRecommendedAction: string;
}

export async function analyzeWebsite(
  url: string,
  content: ScrapedContent
): Promise<AIReport> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const prompt = buildPrompt(url, content);

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://intelli-scan-ai.vercel.app",
      "X-Title": "IntelliScan AI",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are IntelliScan AI, an expert business automation analyst. You analyze websites and produce structured AI opportunity reports. You are neutral and trusted — you recommend solutions by CATEGORY first (e.g., AI chatbot, lead funnel, email automation), then list implementation options: DIY tools, third-party services, and NOFA AI Factory custom builds. Your reports are data-driven and practical. Always respond with valid JSON matching the exact schema requested.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("No response from AI model");
  }

  try {
    const parsed = JSON.parse(raw) as AIReport;
    // Validate essential fields
    if (!parsed.industry || !parsed.recommendations) {
      throw new Error("Incomplete report");
    }
    return parsed;
  } catch {
    throw new Error("Failed to parse AI response");
  }
}

function buildPrompt(url: string, content: ScrapedContent): string {
  return `Analyze this business website and produce a structured AI Opportunity Report.

**Website URL:** ${url}
**Page Title:** ${content.title}
**Meta Description:** ${content.metaDescription}

**Key Headings:**
${content.headings.join("\n")}

**Page Content (excerpt):**
${content.bodyText}

**Detected Features:**
- Contact Form: ${content.hasContactForm ? "Yes" : "No"}
- Chat Widget: ${content.hasChatWidget ? "Yes" : "No"}
- Newsletter Signup: ${content.hasNewsletter ? "Yes" : "No"}
- E-commerce: ${content.hasEcommerce ? "Yes" : "No"}
- Social Media Links: ${content.socialLinks.length > 0 ? content.socialLinks.join(", ") : "None detected"}
- Tech Stack: ${content.techIndicators.length > 0 ? content.techIndicators.join(", ") : "Not detected"}

**Instructions:**
1. Detect the industry/niche
2. Write a 2-3 sentence business snapshot
3. Identify 3-5 current strengths
4. Identify 3-5 missing automations or AI opportunities
5. For each opportunity, recommend a solution by CATEGORY (e.g., "AI Chatbot", "Lead Capture Funnel", "Email Automation", "SEO Content Automation", "Customer Support Automation", "Appointment Scheduling", "Review Management"), then:
   - List 2-3 DIY tools the business could use themselves
   - List 2-3 third-party services/platforms
   - Describe what NOFA AI Factory could custom-build for them
   - Estimate time saved per week/month
   - Estimate revenue impact
6. Provide overall estimated time saved and revenue opportunity
7. Suggest the single most impactful next action

Respond with valid JSON in this exact schema:
{
  "industry": "string",
  "businessSnapshot": "string",
  "strengths": ["string"],
  "missingAutomations": ["string"],
  "recommendations": [
    {
      "category": "string",
      "description": "string",
      "diyTools": ["string"],
      "thirdPartyTools": ["string"],
      "nofaOption": "string",
      "estimatedTimeSaved": "string",
      "estimatedRevenueImpact": "string"
    }
  ],
  "overallTimeSaved": "string",
  "overallRevenueOpportunity": "string",
  "nextRecommendedAction": "string"
}`;
}
