import * as cheerio from "cheerio";

export interface ScrapedContent {
  title: string;
  metaDescription: string;
  headings: string[];
  bodyText: string;
  links: string[];
  hasContactForm: boolean;
  hasChatWidget: boolean;
  hasNewsletter: boolean;
  hasEcommerce: boolean;
  socialLinks: string[];
  techIndicators: string[];
}

export async function scrapeWebsite(url: string): Promise<ScrapedContent> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; IntelliScanBot/1.0; +https://intelli-scan-ai.vercel.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, and non-content elements
    $("script, style, noscript, iframe, svg").remove();

    const title = $("title").text().trim();
    const metaDescription = $('meta[name="description"]').attr("content")?.trim() || "";

    const headings: string[] = [];
    $("h1, h2, h3").each((_, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });

    // Get visible body text (limited to avoid token bloat)
    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);

    const links: string[] = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href) links.push(href);
    });

    const htmlLower = html.toLowerCase();

    const hasContactForm =
      $("form").length > 0 ||
      htmlLower.includes("contact") ||
      htmlLower.includes("get in touch");

    const hasChatWidget =
      htmlLower.includes("tawk.to") ||
      htmlLower.includes("intercom") ||
      htmlLower.includes("drift") ||
      htmlLower.includes("zendesk") ||
      htmlLower.includes("livechat") ||
      htmlLower.includes("chatbot") ||
      htmlLower.includes("crisp.chat") ||
      htmlLower.includes("tidio");

    const hasNewsletter =
      htmlLower.includes("newsletter") ||
      htmlLower.includes("subscribe") ||
      htmlLower.includes("mailchimp") ||
      htmlLower.includes("convertkit");

    const hasEcommerce =
      htmlLower.includes("add to cart") ||
      htmlLower.includes("shopify") ||
      htmlLower.includes("woocommerce") ||
      htmlLower.includes("stripe") ||
      htmlLower.includes("checkout");

    const socialLinks: string[] = [];
    links.forEach((link) => {
      if (
        link.includes("facebook.com") ||
        link.includes("twitter.com") ||
        link.includes("x.com") ||
        link.includes("linkedin.com") ||
        link.includes("instagram.com") ||
        link.includes("youtube.com")
      ) {
        socialLinks.push(link);
      }
    });

    const techIndicators: string[] = [];
    if (htmlLower.includes("google-analytics") || htmlLower.includes("gtag")) techIndicators.push("Google Analytics");
    if (htmlLower.includes("facebook pixel") || htmlLower.includes("fbq(")) techIndicators.push("Facebook Pixel");
    if (htmlLower.includes("hotjar")) techIndicators.push("Hotjar");
    if (htmlLower.includes("hubspot")) techIndicators.push("HubSpot");
    if (htmlLower.includes("salesforce")) techIndicators.push("Salesforce");
    if (htmlLower.includes("wordpress")) techIndicators.push("WordPress");
    if (htmlLower.includes("shopify")) techIndicators.push("Shopify");
    if (htmlLower.includes("squarespace")) techIndicators.push("Squarespace");
    if (htmlLower.includes("wix")) techIndicators.push("Wix");

    return {
      title,
      metaDescription,
      headings: headings.slice(0, 20),
      bodyText,
      links: links.slice(0, 50),
      hasContactForm,
      hasChatWidget,
      hasNewsletter,
      hasEcommerce,
      socialLinks,
      techIndicators,
    };
  } finally {
    clearTimeout(timeout);
  }
}
