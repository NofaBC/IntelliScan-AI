"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { ScanReport } from "@/types";
import { getPlanLimits } from "@/lib/plans";
import ReportView from "@/components/ReportView";

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const [report, setReport] = useState<ScanReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    async function load() {
      const snap = await getDoc(doc(db, "reports", id));
      if (snap.exists()) {
        const data = snap.data();
        setReport({
          id: snap.id,
          ...data,
          scanDate: data.scanDate?.toDate?.() || new Date(data.scanDate),
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        } as ScanReport);
      }
      setLoading(false);
    }
    load();
  }, [user, id]);

  const planLimits = getPlanLimits(profile?.plan || "free");

  const handleExportPdf = async () => {
    if (!report) return;

    const jsPDF = (await import("jspdf")).default;
    await import("jspdf-autotable");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 20;

    const addText = (text: string, x: number, yPos: number, opts?: { fontSize?: number; fontStyle?: string; maxWidth?: number }) => {
      pdf.setFontSize(opts?.fontSize || 10);
      if (opts?.fontStyle) pdf.setFont("helvetica", opts.fontStyle);
      else pdf.setFont("helvetica", "normal");
      const maxW = opts?.maxWidth || pageWidth - 30;
      const lines = pdf.splitTextToSize(text, maxW);
      if (yPos + lines.length * 5 > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(lines, x, yPos);
      return yPos + lines.length * 5 + 2;
    };

    // Header
    pdf.setFillColor(0, 74, 173);
    pdf.rect(0, 0, pageWidth, 35, "F");
    pdf.setTextColor(255, 255, 255);
    y = addText("IntelliScan AI™ — AI Opportunity Report", 15, 15, { fontSize: 16, fontStyle: "bold" });
    y = addText(`${report.url}  |  Scanned: ${new Date(report.scanDate).toLocaleDateString()}`, 15, 25, { fontSize: 9 });
    pdf.setTextColor(0, 0, 0);
    y = 45;

    // Industry & Snapshot
    y = addText("Detected Industry", 15, y, { fontSize: 12, fontStyle: "bold" });
    y = addText(report.industry, 15, y);
    y += 3;
    y = addText("Business Snapshot", 15, y, { fontSize: 12, fontStyle: "bold" });
    y = addText(report.businessSnapshot, 15, y);
    y += 5;

    // Strengths
    y = addText("Strengths", 15, y, { fontSize: 12, fontStyle: "bold" });
    report.strengths.forEach((s) => {
      y = addText(`✓  ${s}`, 18, y);
    });
    y += 5;

    // Missing Automations
    y = addText("Missing Automations", 15, y, { fontSize: 12, fontStyle: "bold" });
    report.missingAutomations.forEach((m) => {
      y = addText(`!  ${m}`, 18, y);
    });
    y += 5;

    // Recommendations
    y = addText("Recommended Solutions", 15, y, { fontSize: 14, fontStyle: "bold" });
    y += 3;
    report.recommendations.forEach((rec) => {
      if (y > pdf.internal.pageSize.getHeight() - 60) {
        pdf.addPage();
        y = 20;
      }
      y = addText(rec.category, 15, y, { fontSize: 11, fontStyle: "bold" });
      y = addText(rec.description, 15, y);
      y = addText(`DIY Tools: ${rec.diyTools.join(", ")}`, 18, y, { fontSize: 9 });
      y = addText(`Third-Party: ${rec.thirdPartyTools.join(", ")}`, 18, y, { fontSize: 9 });
      y = addText(`Custom Build: ${rec.nofaOption}`, 18, y, { fontSize: 9 });
      y = addText(`Time Saved: ${rec.estimatedTimeSaved}  |  Revenue Impact: ${rec.estimatedRevenueImpact}`, 18, y, { fontSize: 9 });
      y += 5;
    });

    // Summary
    if (y > pdf.internal.pageSize.getHeight() - 40) {
      pdf.addPage();
      y = 20;
    }
    pdf.setFillColor(230, 238, 248);
    pdf.rect(10, y - 5, pageWidth - 20, 30, "F");
    y = addText("Overall Impact Summary", 15, y, { fontSize: 12, fontStyle: "bold" });
    y = addText(`Time Saved: ${report.overallTimeSaved}`, 15, y);
    y = addText(`Revenue Opportunity: ${report.overallRevenueOpportunity}`, 15, y);
    y = addText(`Next Action: ${report.nextRecommendedAction}`, 15, y);
    y += 8;

    // CTA
    y = addText("Want this built for you? Contact NOFA AI Factory™ — contact@nofabc.com", 15, y, { fontSize: 10, fontStyle: "bold" });

    pdf.save(`IntelliScan-Report-${new Date(report.scanDate).toISOString().split("T")[0]}.pdf`);
  };

  if (loading) return <p className="text-gray-500 p-6">Loading report...</p>;
  if (!report) return <p className="text-red-500 p-6">Report not found.</p>;

  return (
    <div>
      <div className="mb-4">
        <Link href={report.websiteId ? `/dashboard/websites/${report.websiteId}` : "/dashboard"} className="text-sm text-brand-500 hover:underline">
          ← Back
        </Link>
      </div>
      <ReportView
        report={report}
        onExportPdf={handleExportPdf}
        canExportPdf={planLimits.canExportPdf}
      />
    </div>
  );
}
