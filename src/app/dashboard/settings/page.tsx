"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { PLANS } from "@/lib/plans";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const plan = profile?.plan || "free";
  const planConfig = PLANS[plan];

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Account */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{profile?.displayName || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.email || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member since</p>
            <p className="font-medium">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-brand-500 capitalize">{planConfig.name}</p>
            <p className="text-gray-500 text-sm">{planConfig.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${planConfig.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Plan includes:</h3>
          <ul className="space-y-1">
            {planConfig.features.map((f, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {plan !== "agency" && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/pricing" className="btn-primary text-sm !py-2">
              Upgrade Plan
            </Link>
          </div>
        )}
      </div>

      {/* Scan Settings */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Scan Settings</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Scan Frequency</p>
            <p className="font-medium capitalize">{planConfig.scanFrequency}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Website Limit</p>
            <p className="font-medium">{planConfig.websiteLimit} website{planConfig.websiteLimit > 1 ? "s" : ""}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">PDF Export</p>
            <p className="font-medium">{plan !== "free" ? "Enabled" : "Upgrade to enable"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
