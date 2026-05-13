import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSavedSearchAlert } from "@/lib/email";

export const runtime = "nodejs";
// Vercel Cron: runs daily at 8am UTC
export const dynamic = "force-dynamic";

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // 1. Get all active saved searches with profile data
  const { data: searches, error: searchError } = await supabase
    .from("saved_searches")
    .select("*, profiles(email, full_name)")
    .eq("is_active", true);

  if (searchError) {
    console.error("Failed to fetch saved searches:", searchError);
    return NextResponse.json(
      { error: "Failed to fetch saved searches" },
      { status: 500 }
    );
  }

  // 2. For each search, find new matching listings since last_alerted_at
  let totalAlerts = 0;

  for (const search of searches ?? []) {
    const criteria = search.criteria;
    const since = search.last_alerted_at || search.created_at;

    let query = supabase
      .from("listings")
      .select("id, slug, make, model, year, price, listing_images(url)")
      .eq("status", "approved")
      .gt("created_at", since);

    if (criteria.make) query = query.eq("make", criteria.make);
    if (criteria.model) query = query.ilike("model", `%${criteria.model}%`);
    if (criteria.maxPrice) query = query.lte("price", criteria.maxPrice);
    if (criteria.minYear) query = query.gte("year", criteria.minYear);
    if (criteria.maxYear) query = query.lte("year", criteria.maxYear);

    const { data: matches } = await query.limit(10);

    if (matches && matches.length > 0) {
      // 3. Send email digest
      await sendSavedSearchAlert({
        email: search.profiles.email,
        name: search.profiles.full_name,
        criteria,
        matches,
      });

      // 4. Update last_alerted_at
      await supabase
        .from("saved_searches")
        .update({ last_alerted_at: new Date().toISOString() })
        .eq("id", search.id);

      totalAlerts++;
    }
  }

  return NextResponse.json({
    processed: searches?.length ?? 0,
    alerts: totalAlerts,
  });
}
