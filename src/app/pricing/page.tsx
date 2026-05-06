"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PLANS, PUBLIC_PLANS } from "@/lib/plans";
import { useAuth } from "@/lib/auth-context";
import { PlanTier } from "@/types";

export default function PricingPage() {
  const { user, profile, getIdToken } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: PlanTier) => {
    if (!user) {
      router.push("/signup");
      return;
    }

    const plan = PLANS[planId];
    if (!plan.stripePriceId) {
      alert("This plan is not available for purchase yet.");
      return;
    }

    // If already on this plan, go to portal
    if (profile?.plan === planId) {
      return;
    }

    setLoadingPlan(planId);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priceId: plan.stripePriceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Your website changes. Your AI opportunities change too.
          <br />
          IntelliScan AI™ monitors both.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PUBLIC_PLANS.map((planId) => {
          const plan = PLANS[planId];
          const isCurrentPlan = profile?.plan === planId;
          const isLoading = loadingPlan === planId;
          return (
            <div
              key={plan.id}
              className={`card relative flex flex-col ${
                plan.highlighted
                  ? "border-2 border-brand-500 shadow-lg scale-[1.02]"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan.tagline}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-brand-500">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(planId)}
                disabled={isCurrentPlan || isLoading}
                className={`w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isCurrentPlan
                    ? "bg-green-100 text-green-700 cursor-default"
                    : plan.highlighted
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } disabled:opacity-70`}
              >
                {isCurrentPlan
                  ? "Current Plan"
                  : isLoading
                  ? "Redirecting..."
                  : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ / Info */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Not sure which plan is right?
        </h3>
        <p className="text-gray-600 max-w-xl mx-auto">
          Start with Starter to see the value. Upgrade anytime as you add more
          websites or need faster scan frequencies. All plans include the
          &quot;Build This for Me&quot; option to connect with NOFA AI Factory™.
        </p>
        {!user && (
          <Link href="/signup" className="btn-primary inline-block mt-6">
            Start Free Trial
          </Link>
        )}
      </div>
    </div>
  );
}
