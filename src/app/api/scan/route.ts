import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { scrapeWebsite } from "@/lib/scraper";
import { analyzeWebsite } from "@/lib/openrouter";
import { getNextScanDate } from "@/lib/plans";
import { Timestamp } from "firebase-admin/firestore";

export const maxDuration = 60; // Allow up to 60s for scraping + AI analysis

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    const userId = decoded.uid;

    // Parse request
    const { websiteId, url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Verify website ownership if websiteId provided
    if (websiteId) {
      const siteDoc = await adminDb.collection("websites").doc(websiteId).get();
      if (!siteDoc.exists || siteDoc.data()?.userId !== userId) {
        return NextResponse.json({ error: "Website not found" }, { status: 404 });
      }
    }

    // Step 1: Scrape website content
    const scrapedContent = await scrapeWebsite(url);

    // Step 2: Analyze with AI
    const aiReport = await analyzeWebsite(url, scrapedContent);

    // Step 3: Save report to Firestore
    const now = Timestamp.now();
    const reportData = {
      websiteId: websiteId || null,
      userId,
      url,
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
    };

    const reportRef = await adminDb.collection("reports").add(reportData);

    // Step 4: Update website document
    if (websiteId) {
      const siteDoc = await adminDb.collection("websites").doc(websiteId).get();
      const siteData = siteDoc.data();
      const frequency = siteData?.scanFrequency || "monthly";

      await adminDb.collection("websites").doc(websiteId).update({
        lastScannedAt: now,
        nextScanAt: Timestamp.fromDate(getNextScanDate(frequency)),
        industry: aiReport.industry,
      });
    }

    return NextResponse.json({
      report: {
        id: reportRef.id,
        ...reportData,
        scanDate: now.toDate(),
        createdAt: now.toDate(),
      },
    });
  } catch (error: unknown) {
    console.error("Scan error:", error);
    const message = error instanceof Error ? error.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
