import { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  Crown,
  AlertTriangle,
  Clock,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { requireSeller } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { BillingPortalButton } from "@/components/billing-portal-button";

export const metadata: Metadata = {
  title: `Billing — ${siteConfig.name}`,
};

type BillingPlan = "free" | "collector" | "dealer";
type BillingStatus = "active" | "trialing" | "past_due" | "canceled";

interface BillingProfile {
  billing_plan: BillingPlan;
  billing_status: BillingStatus;
  listing_limit: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  trial_end: string | null;
}

const PLAN_DETAILS: Record<
  BillingPlan,
  { name: string; price: number; interval: string; listings: number }
> = {
  free: { name: "Free", price: 0, interval: "month", listings: 3 },
  collector: { name: "Collector", price: 29, interval: "month", listings: 10 },
  dealer: { name: "Dealer", price: 79, interval: "month", listings: 50 },
};

const STATUS_STYLES: Record<
  BillingStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  trialing: {
    label: "Trial",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  past_due: {
    label: "Past Due",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  canceled: {
    label: "Canceled",
    className: "bg-stone-100 text-stone-500 ring-stone-200",
  },
};

// Mock invoice data (will be replaced with Stripe API calls)
const MOCK_INVOICES = [
  {
    id: "INV-001",
    date: "2026-05-01",
    amount: 29,
    status: "paid" as const,
    pdf: "#",
  },
  {
    id: "INV-002",
    date: "2026-04-01",
    amount: 29,
    status: "paid" as const,
    pdf: "#",
  },
  {
    id: "INV-003",
    date: "2026-03-01",
    amount: 29,
    status: "paid" as const,
    pdf: "#",
  },
];

function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDaysRemaining(dateString: string | null): number | null {
  if (!dateString) return null;
  const end = new Date(dateString);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default async function BillingPage() {
  const { user } = await requireSeller();
  const supabase = await createClient();

  // Try to fetch billing fields; handle case where columns don't exist yet
  let billing: BillingProfile = {
    billing_plan: "free",
    billing_status: "active",
    listing_limit: 3,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    current_period_end: null,
    trial_end: null,
  };

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "billing_plan, billing_status, listing_limit, stripe_customer_id, stripe_subscription_id, current_period_end, trial_end"
      )
      .eq("id", user.id)
      .single();

    if (profile && !error) {
      billing = {
        billing_plan: (profile.billing_plan as BillingPlan) ?? "free",
        billing_status: (profile.billing_status as BillingStatus) ?? "active",
        listing_limit: (profile.listing_limit as number) ?? 3,
        stripe_customer_id: profile.stripe_customer_id as string | null,
        stripe_subscription_id: profile.stripe_subscription_id as string | null,
        current_period_end: profile.current_period_end as string | null,
        trial_end: profile.trial_end as string | null,
      };
    }
  } catch {
    // Billing columns likely don't exist yet — use defaults
  }

  // Count active listings for usage display
  let listingCount = 0;
  try {
    const { count } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", user.id);
    listingCount = count ?? 0;
  } catch {
    // Listings table may not exist yet
  }

  const plan = PLAN_DETAILS[billing.billing_plan];
  const statusStyle = STATUS_STYLES[billing.billing_status];
  const usagePercent = Math.min(
    100,
    Math.round((listingCount / billing.listing_limit) * 100)
  );
  const trialDaysRemaining = getDaysRemaining(billing.trial_end);
  const hasBilling = !!billing.stripe_customer_id;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-stone-900">
          Billing
        </h2>
        <p className="mt-1 text-stone-500">
          Manage your subscription, usage, and invoices.
        </p>
      </div>

      {/* Payment warning */}
      {billing.billing_status === "past_due" && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Payment failed
            </p>
            <p className="mt-0.5 text-sm text-red-700">
              Update your payment method to avoid a downgrade to the Free plan.
            </p>
          </div>
        </div>
      )}

      {/* Trial info */}
      {billing.billing_status === "trialing" && trialDaysRemaining !== null && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Clock className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {trialDaysRemaining} day{trialDaysRemaining !== 1 ? "s" : ""}{" "}
              remaining in your trial
            </p>
            <p className="mt-0.5 text-sm text-amber-700">
              Your trial ends on {formatDate(billing.trial_end)}. Add a payment
              method to continue after the trial.
            </p>
          </div>
        </div>
      )}

      {/* Plan & Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan */}
        <div className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Crown className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-500">
                  Current Plan
                </h3>
                <p className="text-xl font-bold text-stone-900">{plan.name}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusStyle.className}`}
            >
              {statusStyle.label}
            </span>
          </div>

          {plan.price > 0 && (
            <div className="mt-4 border-t border-stone-100 pt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-stone-900">
                  ${plan.price}
                </span>
                <span className="text-sm text-stone-500">/{plan.interval}</span>
              </div>
              {billing.current_period_end && (
                <p className="mt-1 text-xs text-stone-400">
                  Next billing: {formatDate(billing.current_period_end)}
                </p>
              )}
            </div>
          )}

          {plan.price === 0 && (
            <div className="mt-4 border-t border-stone-100 pt-4">
              <p className="text-sm text-stone-500">
                Upgrade to list more cars and unlock premium features.
              </p>
            </div>
          )}
        </div>

        {/* Listing Usage */}
        <div className="rounded-xl bg-white p-6 ring-1 ring-stone-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CreditCard className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-500">
                Listing Usage
              </h3>
              <p className="text-xl font-bold text-stone-900">
                {listingCount} of {billing.listing_limit}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-stone-100 pt-4">
            {/* Progress bar */}
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                {listingCount} listing{listingCount !== 1 ? "s" : ""} used
              </span>
              <span className="font-medium text-stone-700">{usagePercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent >= 90
                    ? "bg-red-500"
                    : usagePercent >= 70
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usagePercent >= 90 && (
              <p className="mt-2 text-xs text-red-600">
                You are approaching your listing limit. Consider upgrading.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/sell#pricing"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-amber-400"
        >
          <ArrowUpRight className="size-4" />
          Upgrade Plan
        </Link>

        {hasBilling && <BillingPortalButton />}

        {!hasBilling && (
          <span className="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-5 py-2.5 text-sm font-medium text-stone-400 cursor-not-allowed">
            <ExternalLink className="size-4" />
            Manage Billing
          </span>
        )}
      </div>

      {/* Invoice History */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-stone-900">
          Invoice History
        </h3>

        {hasBilling ? (
          <div className="overflow-hidden rounded-xl bg-white ring-1 ring-stone-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="px-4 py-3 text-left font-medium text-stone-500">
                    Invoice
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-stone-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-stone-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-stone-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-stone-500">
                    PDF
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {MOCK_INVOICES.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {invoice.id}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          invoice.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : invoice.status === "pending"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {invoice.status === "paid" ? (
                          <CheckCircle className="size-3" />
                        ) : invoice.status === "failed" ? (
                          <XCircle className="size-3" />
                        ) : (
                          <Clock className="size-3" />
                        )}
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={invoice.pdf}
                        className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="size-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center ring-1 ring-stone-200">
            <CreditCard className="mx-auto size-8 text-stone-300" />
            <p className="mt-3 text-sm text-stone-500">
              No invoices yet. Upgrade to a paid plan to see your billing
              history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
