import { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Clock, Car, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: `My Inquiries — ${siteConfig.name}`,
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "Sent", className: "bg-amber-100 text-amber-700" },
  read: { label: "Replied", className: "bg-emerald-100 text-emerald-700" },
  archived: { label: "Archived", className: "bg-stone-100 text-stone-500" },
};

interface InquiryRow {
  id: string;
  message: string;
  status: string;
  created_at: string;
  listings: {
    slug: string;
    make: string;
    model: string;
    year: number;
  } | null;
}

export default async function BuyerInquiriesPage() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data } = await supabase
    .from("inquiries")
    .select("id, message, status, created_at, listings(slug, make, model, year)")
    .or(
      `buyer_email.eq.${user.email ?? ""},buyer_user_id.eq.${user.id}`
    )
    .order("created_at", { ascending: false });

  // Supabase join returns listings as object (single FK), normalize
  const inquiries = (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    listings: Array.isArray(row.listings) ? row.listings[0] ?? null : row.listings ?? null,
  })) as unknown as InquiryRow[];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-stone-900">
          My Inquiries
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Messages you have sent to sellers
        </p>
      </div>

      {inquiries.length > 0 ? (
        <div className="space-y-3">
          {inquiries.map((inquiry) => {
            const status = statusConfig[inquiry.status] ?? statusConfig.new;
            const listing = inquiry.listings;
            const title = listing
              ? `${listing.year} ${listing.make} ${listing.model}`
              : "Listing";

            return (
              <div
                key={inquiry.id}
                className="rounded-xl bg-white p-4 ring-1 ring-stone-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Car className="size-3.5 shrink-0 text-amber-600" />
                      {listing ? (
                        <Link
                          href={`/cars/${listing.slug}`}
                          className="text-sm font-semibold text-stone-900 hover:text-amber-600 truncate"
                        >
                          {title}
                          <ExternalLink className="ml-1 inline size-3" />
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-stone-900 truncate">
                          {title}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <Clock className="size-3" />
                      {formatDate(inquiry.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-20 ring-1 ring-stone-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <MessageSquare className="size-6 text-stone-400" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-stone-900">
            No inquiries yet
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-stone-500">
            When you contact a seller about a car, your messages will appear
            here.
          </p>
          <Link
            href="/cars"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-amber-500 px-6 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
          >
            Browse Cars
          </Link>
        </div>
      )}
    </div>
  );
}
