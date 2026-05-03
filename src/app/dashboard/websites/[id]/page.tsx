"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Website, ScanReport } from "@/types";
import { getPlanLimits } from "@/lib/plans";

export default function WebsiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile, getIdToken } = useAuth();
  const [website, setWebsite] = useState<Website | null>(null);
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");

  useEffect(() => {
    if (!user || !id) return;
    async function load() {
      const siteDoc = await getDoc(doc(db, "websites", id));
      if (siteDoc.exists()) {
        setWebsite({ id: siteDoc.id, ...siteDoc.data() } as Website);
      }

      const reportsSnap = await getDocs(
        query(
          collection(db, "reports"),
          where("websiteId", "==", id),
          where("userId", "==", user!.uid),
          orderBy("scanDate", "desc")
        )
      );
      setReports(reportsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ScanReport)));
      setLoading(false);
    }
    load();
  }, [user, id]);

  const handleScan = async () => {
    if (!website) return;
    setScanning(true);
    setScanError("");
    try {
      const token = await getIdToken();
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ websiteId: website.id, url: website.url }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Scan failed");
      }
      const data = await res.json();
      // Add new report to the top of the list
      setReports((prev) => [data.report, ...prev]);
      // Update website last scanned
      setWebsite((prev) => prev ? { ...prev, lastScannedAt: new Date(), industry: data.report.industry } : prev);
    } catch (err: unknown) {
      setScanError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const planLimits = getPlanLimits(profile?.plan || "free");

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!website) return <p className="text-red-500">Website not found.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <Link href="/dashboard/websites" className="text-sm text-brand-500 hover:underline">
            ← Back to Websites
          </Link>
          <h1 className="text-2xl font-bold mt-2">{website.name || website.url}</h1>
          <p className="text-gray-500 text-sm">{website.url}</p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="btn-primary !py-2"
        >
          {scanning ? "Scanning..." : "Scan Now"}
        </button>
      </div>

      {scanError && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{scanError}</div>
      )}

      {scanning && (
        <div className="card bg-brand-50 border-brand-200">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-brand-500 border-t-transparent rounded-full"></div>
            <p className="text-brand-700 font-medium">
              Analyzing website content... This may take 15-30 seconds.
            </p>
          </div>
        </div>
      )}

      {/* Website Info */}
      <div className="card">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Industry</p>
            <p className="font-medium">{website.industry || "Not detected"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Scan Frequency</p>
            <p className="font-medium capitalize">{website.scanFrequency}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Scanned</p>
            <p className="font-medium">
              {website.lastScannedAt
                ? new Date(website.lastScannedAt).toLocaleDateString()
                : "Never"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className="font-medium capitalize">{website.status}</p>
          </div>
        </div>
      </div>

      {/* Report History */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">
          Scan History
          {!planLimits.hasSavedHistory && (
            <span className="text-sm text-gray-400 font-normal ml-2">
              (Upgrade to save history)
            </span>
          )}
        </h2>
        {reports.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No scans yet. Click &quot;Scan Now&quot; to run your first analysis.
          </p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/reports/${report.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
              >
                <div>
                  <p className="font-medium">
                    {report.industry} &middot; {report.recommendations?.length || 0} recommendations
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{report.businessSnapshot?.slice(0, 80)}...</p>
                </div>
                <p className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {new Date(report.scanDate).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
