import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { scrapeWebsite } from "@/lib/scraper";
import { analyzeWebsite } from "@/lib/openrouter";
import { getNextScanDate } from "@/lib/plans";
import { Timestamp } from "firebase-admin/firestore";

export const maxDuration = 300; // 5 min for batch processing

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets this automatically for cron jobs)
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = Timestamp.now();

    // Find websites due for scanning
    const websitesSnap = await adminDb
      .collection("websites")
      .where("status", "==", "active")
      .where("nextScanAt", "<=", now)
      .limit(10) // Process in batches to stay within timeout
      .get();

    if (websitesSnap.empty) {
      return NextResponse.json({ message: "No websites due for scanning", scanned: 0 });
    }

    const results: { websiteId: string; success: boolean; error?: string }[] = [];

    for (const siteDoc of websitesSnap.docs) {
      const site = siteDoc.data();
      try {
        // Scrape
        const content = await scrapeWebsite(site.url);

        // Analyze
        const aiReport = await analyzeWebsite(site.url, content);

        // Save report
        await adminDb.collection("reports").add({
          websiteId: siteDoc.id,
          userId: site.userId,
          url: site.url,
          scanDate: now,
          industry: aiReport.industry,
          businessSnapshot: aiReport.businessSnapshot,
          strengths: aiReport.strengths,
          missingAutomations: aiReport.missingAutomations,
          recommendations: aiReport.recommendations,
          overallTimeSaved: aiReport.overallTimeSaved,
          overallRevenueOpportunity: aiReport.overallRevenueOpportunity,
          nextRecommendedAction: aiReport.nextRecommendedAction,
          createdAt: now,
        });

        // Update website
        const frequency = site.scanFrequency || "monthly";
        await adminDb.collection("websites").doc(siteDoc.id).update({
          lastScannedAt: now,
          nextScanAt: Timestamp.fromDate(getNextScanDate(frequency)),
          industry: aiReport.industry,
        });

        results.push({ websiteId: siteDoc.id, success: true });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(`Cron scan failed for ${site.url}:`, message);
        results.push({ websiteId: siteDoc.id, success: false, error: message });

        // Push next scan forward even on failure to avoid infinite retries
        const frequency = site.scanFrequency || "monthly";
        await adminDb.collection("websites").doc(siteDoc.id).update({
          nextScanAt: Timestamp.fromDate(getNextScanDate(frequency)),
        });
      }
    }

    const succeeded = results.filter((r) => r.success).length;
    return NextResponse.json({
      message: `Scanned ${succeeded}/${results.length} websites`,
      results,
    });
  } catch (error: unknown) {
    console.error("Cron scan error:", error);
    return NextResponse.json({ error: "Cron scan failed" }, { status: 500 });
  }
}
