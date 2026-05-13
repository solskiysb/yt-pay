import { CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

const statusStyles: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default async function PaymentsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(
      `id, amount, status, paid_at, created_at, listing_id, seller_id,
       profiles!payments_seller_id_fkey(full_name),
       listings!payments_listing_id_fkey(make, model, year)`
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Payments fetch error:", error);
  }

  const payments = (data ?? []).map((row) => {
    const profileRaw = row.profiles as unknown;
    const profile = Array.isArray(profileRaw)
      ? (profileRaw[0] as { full_name: string | null } | undefined) ?? null
      : (profileRaw as { full_name: string | null } | null);
    const listingRaw = row.listings as unknown;
    const listing = Array.isArray(listingRaw)
      ? (listingRaw[0] as { make: string; model: string; year: number } | undefined) ?? null
      : (listingRaw as { make: string; model: string; year: number } | null);

    return {
      id: row.id as string,
      seller: profile?.full_name ?? "Unknown",
      listing: listing
        ? `${listing.year} ${listing.make} ${listing.model}`
        : "Unknown listing",
      amount: row.amount as number,
      status: row.status as string,
      date: row.paid_at
        ? new Date(row.paid_at as string).toISOString().split("T")[0]
        : new Date(row.created_at as string).toISOString().split("T")[0],
    };
  });

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Payments</h2>
          <p className="text-sm text-stone-500">
            {payments.length} transaction{payments.length !== 1 ? "s" : ""}
            {totalRevenue > 0 && <> &middot; &euro;{totalRevenue.toLocaleString()} total revenue</>}
          </p>
        </div>
        {totalRevenue > 0 && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2">
            <CreditCard className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              &euro;{totalRevenue.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white px-4 py-12 text-center">
          <CreditCard className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-3 text-sm text-stone-400">No payments yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs font-medium uppercase tracking-wider text-stone-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-2.5 font-mono text-xs text-stone-500">
                    {p.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-2.5 text-stone-700">{p.seller}</td>
                  <td className="max-w-48 truncate px-4 py-2.5 text-stone-700">
                    {p.listing}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-stone-900">
                    &euro;{p.amount}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[p.status] ?? "bg-stone-100 text-stone-500"}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-stone-500">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
