import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";
import { PLANS } from "@/lib/plans";
import { PlanTier } from "@/types";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const firebaseUid = session.metadata?.firebaseUid;
          if (firebaseUid) {
            const subscription = await getStripe().subscriptions.retrieve(
              session.subscription as string
            );
            const priceId = subscription.items.data[0]?.price.id;
            const plan = priceIdToPlan(priceId);

            await adminDb.collection("users").doc(firebaseUid).update({
              plan,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscription.id,
              updatedAt: new Date(),
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const firebaseUid = subscription.metadata?.firebaseUid;
        if (firebaseUid) {
          const priceId = subscription.items.data[0]?.price.id;
          const plan = priceIdToPlan(priceId);
          const isActive = ["active", "trialing"].includes(subscription.status);

          await adminDb.collection("users").doc(firebaseUid).update({
            plan: isActive ? plan : "free",
            stripeSubscriptionId: subscription.id,
            updatedAt: new Date(),
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const firebaseUid = subscription.metadata?.firebaseUid;
        if (firebaseUid) {
          await adminDb.collection("users").doc(firebaseUid).update({
            plan: "free",
            stripeSubscriptionId: null,
            updatedAt: new Date(),
          });
        }
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

function priceIdToPlan(priceId: string): PlanTier {
  for (const [key, config] of Object.entries(PLANS)) {
    if (config.stripePriceId === priceId) {
      return key as PlanTier;
    }
  }
  return "free";
}
