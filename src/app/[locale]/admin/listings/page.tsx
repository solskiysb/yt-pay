import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { ListingsTable } from "../components";

export default async function ListingsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select(
      `id, slug, make, model, year, price, status, is_featured, views_count, contacts_count, created_at, seller_id,
       profiles!listings_seller_id_fkey(full_name),
       listing_images(url, sort_order, is_primary)`
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Listings fetch error:", error);
  }

  const listings = (data ?? []).map((row) => {
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
      slug: row.slug as string,
      title: `${row.year} ${row.make} ${row.model}`,
      image: primaryImage,
      seller_name: profile?.full_name ?? null,
      price: row.price as number,
      status: row.status as string,
      is_featured: row.is_featured as boolean,
      views_count: (row.views_count as number) ?? 0,
      contacts_count: (row.contacts_count as number) ?? 0,
      created_at: row.created_at as string,
    };
  });

  return <ListingsTable listings={listings} />;
}
