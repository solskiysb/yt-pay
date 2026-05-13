import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { ModerationTable } from "../components";

export default async function ModerationPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `id, slug, make, model, year, price, status, rejection_reason, created_at, seller_id,
       profiles!listings_seller_id_fkey(full_name),
       listing_images(url, sort_order, is_primary)`
    )
    .in("status", ["pending_review", "approved", "rejected"])
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Moderation fetch error:", error);
  }

  const items = (data ?? []).map((row) => {
    const images = (row.listing_images ?? []) as Array<{
      url: string;
      sort_order: number;
      is_primary: boolean;
    }>;
    const primaryImage =
      images.find((img) => img.is_primary)?.url ??
      images.sort((a, b) => a.sort_order - b.sort_order)[0]?.url ??
      null;

    const profileRaw = row.profiles as unknown;
    const profile = Array.isArray(profileRaw)
      ? (profileRaw[0] as { full_name: string | null } | undefined) ?? null
      : (profileRaw as { full_name: string | null } | null);

    return {
      id: row.id as string,
      title: `${row.year} ${row.make} ${row.model}`,
      image: primaryImage,
      seller_name: profile?.full_name ?? null,
      price: row.price as number,
      created_at: row.created_at as string,
      status: row.status as string,
      rejection_reason: (row.rejection_reason as string) ?? null,
    };
  });

  return <ModerationTable items={items} />;
}
