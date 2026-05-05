"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { PLANS } from "@/lib/plans";
import { getNextScanDate } from "@/lib/plans";

export default function NewWebsitePage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const plan = profile?.plan || "free";
  const scanFrequency = PLANS[plan].scanFrequency;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const docRef = await addDoc(collection(getFirebaseDb(), "websites"), {
        userId: user!.uid,
        url: normalizedUrl,
        name: name.trim() || new URL(normalizedUrl).hostname,
        scanFrequency,
        status: "active",
        nextScanAt: Timestamp.fromDate(getNextScanDate(scanFrequency, now)),
        createdAt: Timestamp.fromDate(now),
      });
      router.push(`/dashboard/websites/${docRef.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to add website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Add Website</h1>

      <div className="card">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL *</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field"
              placeholder="https://www.example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="My Business"
            />
          </div>
          <div className="bg-gray-50 px-4 py-3 rounded-lg text-sm text-gray-600">
            Scan frequency: <strong className="capitalize">{scanFrequency}</strong>{" "}
            <span className="text-gray-400">(based on your {plan} plan)</span>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Website"}
          </button>
        </form>
      </div>
    </div>
  );
}
