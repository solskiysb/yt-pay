import { Mail, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-amber-100 text-amber-700",
  replied: "bg-green-100 text-green-700",
  closed: "bg-stone-100 text-stone-500",
};

export default async function InquiriesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      `id, buyer_name, buyer_email, message, status, created_at, listing_id,
       listings!inquiries_listing_id_fkey(make, model, year, slug)`
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Inquiries fetch error:", error);
  }

  const inquiries = (data ?? []).map((row) => {
    const listingRaw = row.listings as unknown;
    const listing = Array.isArray(listingRaw)
      ? (listingRaw[0] as { make: string; model: string; year: number; slug: string } | undefined) ?? null
      : (listingRaw as { make: string; model: string; year: number; slug: string } | null);

    return {
      id: row.id as string,
      buyerName: (row.buyer_name as string) ?? "Unknown",
      buyerEmail: (row.buyer_email as string) ?? "",
      listing: listing
        ? `${listing.year} ${listing.make} ${listing.model}`
        : "Unknown listing",
      listingSlug: listing?.slug ?? "",
      message: (row.message as string) ?? "",
      date: new Date(row.created_at as string).toISOString().split("T")[0],
      status: (row.status as string) ?? "new",
    };
  });

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Inquiries</h2>
          <p className="text-sm text-stone-500">
            {inquiries.length} total
            {newCount > 0 && <> &middot; {newCount} new</>}
          </p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
            <Mail className="h-4 w-4" />
            {newCount} unread
          </div>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white px-4 py-12 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-3 text-sm text-stone-400">No inquiries yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-stone-50">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-stone-900">
                      {inq.buyerName}
                    </p>
                    <p className="text-xs text-stone-400">{inq.buyerEmail}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="text-stone-700">{inq.listing}</p>
                  </td>
                  <td className="max-w-sm px-4 py-2.5">
                    <p className="truncate text-stone-600">{inq.message}</p>
                  </td>
                  <td className="px-4 py-2.5 text-stone-500">{inq.date}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[inq.status] ?? "bg-stone-100 text-stone-500"}`}
                    >
                      {inq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
