"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Website } from "@/types";
import { PLANS } from "@/lib/plans";

export default function WebsitesPage() {
  const { user, profile } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const snap = await getDocs(
        query(collection(db, "websites"), where("userId", "==", user!.uid), orderBy("createdAt", "desc"))
      );
      setWebsites(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Website)));
      setLoading(false);
    }
    load();
  }, [user]);

  const plan = profile?.plan || "free";
  const limit = PLANS[plan].websiteLimit;
  const canAdd = websites.length < limit;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Websites</h1>
        {canAdd && (
          <Link href="/dashboard/websites/new" className="btn-primary text-sm !py-2">
            + Add Website
          </Link>
        )}
      </div>

      {!canAdd && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
          You&apos;ve reached your website limit ({limit}). <Link href="/pricing" className="underline font-medium">Upgrade your plan</Link> to add more.
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : websites.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No websites added yet.</p>
          <Link href="/dashboard/websites/new" className="btn-primary">
            Add Your First Website
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {websites.map((site) => (
            <Link
              key={site.id}
              href={`/dashboard/websites/${site.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{site.name || site.url}</h3>
                  <p className="text-sm text-gray-500 mt-1">{site.url}</p>
                  {site.industry && (
                    <span className="inline-block mt-2 text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded">
                      {site.industry}
                    </span>
                  )}
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-500 capitalize">{site.scanFrequency} scans</p>
                  <p className="text-gray-400 mt-1">
                    {site.lastScannedAt
                      ? `Last: ${new Date(site.lastScannedAt).toLocaleDateString()}`
                      : "Not scanned"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
