"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Website, ScanReport } from "@/types";
import { PLANS } from "@/lib/plans";

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [recentReports, setRecentReports] = useState<ScanReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      try {
        const sitesSnap = await getDocs(
          query(collection(db, "websites"), where("userId", "==", user!.uid), orderBy("createdAt", "desc"))
        );
        const sites = sitesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Website));
        setWebsites(sites);

        const reportsSnap = await getDocs(
          query(
            collection(db, "reports"),
            where("userId", "==", user!.uid),
            orderBy("scanDate", "desc"),
            limit(5)
          )
        );
        setRecentReports(reportsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ScanReport)));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const plan = profile?.plan || "free";
  const planConfig = PLANS[plan];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/dashboard/websites/new" className="btn-primary text-sm !py-2">
          + Add Website
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Websites</p>
          <p className="text-3xl font-bold text-brand-500">
            {websites.length}
            <span className="text-sm text-gray-400 font-normal"> / {planConfig.websiteLimit}</span>
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Scans</p>
          <p className="text-3xl font-bold text-brand-500">{recentReports.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Current Plan</p>
          <p className="text-3xl font-bold text-brand-500 capitalize">{plan}</p>
        </div>
      </div>

      {/* Websites */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Your Websites</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : websites.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No websites added yet.</p>
            <Link href="/dashboard/websites/new" className="btn-primary text-sm">
              Add Your First Website
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {websites.map((site) => (
              <Link
                key={site.id}
                href={`/dashboard/websites/${site.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
              >
                <div>
                  <p className="font-medium">{site.name || site.url}</p>
                  <p className="text-sm text-gray-500">{site.url}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {site.lastScannedAt
                    ? `Last scan: ${new Date(site.lastScannedAt).toLocaleDateString()}`
                    : "Not scanned yet"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Recent Reports</h2>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/reports/${report.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-colors"
              >
                <div>
                  <p className="font-medium">{report.url}</p>
                  <p className="text-sm text-gray-500">{report.industry}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(report.scanDate).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
