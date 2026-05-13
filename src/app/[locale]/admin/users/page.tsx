import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { UsersTable } from "../components";

export default async function UsersPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_verified, is_banned, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Users fetch error:", error);
  }

  // Fetch listing counts per seller
  const { data: listingCounts } = await supabase
    .from("listings")
    .select("seller_id");

  // Count listings per seller
  const countMap = new Map<string, number>();
  for (const row of listingCounts ?? []) {
    const sid = row.seller_id as string;
    countMap.set(sid, (countMap.get(sid) ?? 0) + 1);
  }

  const users = (profiles ?? []).map((p) => ({
    id: p.id as string,
    full_name: p.full_name as string | null,
    email: p.email as string | null,
    role: (p.role as string) ?? "buyer",
    is_verified: (p.is_verified as boolean) ?? false,
    is_banned: (p.is_banned as boolean) ?? false,
    created_at: p.created_at as string,
    listings_count: countMap.get(p.id as string) ?? 0,
  }));

  return <UsersTable users={users} />;
}
