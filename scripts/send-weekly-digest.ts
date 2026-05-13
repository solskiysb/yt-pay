/**
 * Weekly Digest Email Sender
 *
 * Sends a digest of new listings (last 7 days) to all confirmed
 * buyer_alerts / saved_searches subscribers.
 *
 * Usage: npx tsx scripts/send-weekly-digest.ts
 *   --dry-run   Show what would be sent without actually sending
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

const SITE_URL = "https://yt-pay.io";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SavedSearch {
  id: string;
  user_id: string;
  criteria: {
    make?: string;
    model?: string;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
  };
  is_active: boolean;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

interface MatchedListing {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  listing_images: { url: string }[];
}

// ---------------------------------------------------------------------------
// Email HTML builder
// ---------------------------------------------------------------------------

function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

function buildListingCard(car: MatchedListing): string {
  const imageUrl = car.listing_images?.[0]?.url ?? "https://placehold.co/400x260?text=No+Photo";
  const carUrl = `${SITE_URL}/listings/${car.slug}`;

  return `
    <tr>
      <td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafaf9;border-radius:8px;overflow:hidden;">
          <tr>
            <td>
              <img src="${imageUrl}" alt="${car.year} ${car.make} ${car.model}" width="496" style="display:block;width:100%;height:auto;border-radius:8px 8px 0 0;" />
            </td>
          </tr>
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#1c1917;">${car.year} ${car.make} ${car.model}</p>
              <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#d97706;">${formatPrice(car.price)}</p>
              <a href="${carUrl}" style="display:inline-block;padding:10px 20px;background-color:#f59e0b;color:#1c1917;font-size:13px;font-weight:600;text-decoration:none;border-radius:6px;">View on EraMarque</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function buildDigestEmail(name: string, cars: MatchedListing[]): string {
  const listingCards = cars.map(buildListingCard).join("");
  const greeting = name ? `Hi ${name}` : "Hi there";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f5f4;font-family:'Inter','Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1c1917;padding:24px 32px;text-align:center;">
              <span style="font-size:22px;font-weight:700;color:#f59e0b;letter-spacing:2px;">ERAMARQUE</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1c1917;">Your Weekly Digest</h1>
              <p style="margin:0 0 24px;font-size:14px;color:#78716c;">${greeting}, here are <strong>${cars.length} new listing${cars.length !== 1 ? "s" : ""}</strong> from the past week that match your interests.</p>

              <!-- Listing Cards -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${listingCards}
              </table>

              <!-- Browse All -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}/listings" style="display:inline-block;padding:12px 28px;background-color:#ffffff;color:#1c1917;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;border:1px solid #d6d3d1;">Browse All Listings</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #e7e5e4;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#a8a29e;">
                <a href="${SITE_URL}" style="color:#a8a29e;text-decoration:none;">yt-pay.io</a> &mdash; Curated Classics &amp; Beautiful Cars
              </p>
              <p style="margin:0;font-size:11px;color:#d6d3d1;">
                <a href="${SITE_URL}/buyer/saved-searches" style="color:#d6d3d1;text-decoration:underline;">Manage alerts</a> &middot;
                <a href="${SITE_URL}/buyer/saved-searches" style="color:#d6d3d1;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Weekly digest sender${dryRun ? " (DRY RUN)" : ""}...\n`);

  // 1. Fetch active saved searches with profile data
  const { data: searches, error: searchError } = await supabase
    .from("saved_searches")
    .select("id, user_id, criteria, is_active, profiles(email, full_name)")
    .eq("is_active", true);

  if (searchError) {
    console.error("Failed to fetch saved searches:", searchError.message);
    process.exit(1);
  }

  if (!searches || searches.length === 0) {
    console.log("No active subscribers found.");
    return;
  }

  console.log(`Found ${searches.length} active subscriber(s).\n`);

  // 2. For each subscriber, find matching new listings from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const since = sevenDaysAgo.toISOString();

  const resend = dryRun ? null : new Resend(process.env.RESEND_API_KEY!);
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const search of searches as unknown as SavedSearch[]) {
    const criteria = search.criteria ?? {};
    const email = search.profiles?.email;
    const name = search.profiles?.full_name ?? null;

    if (!email) {
      console.log(`  [SKIP] Search ${search.id}: no email on profile`);
      skipped++;
      continue;
    }

    // Build matching query
    let query = supabase
      .from("listings")
      .select("id, slug, make, model, year, price, listing_images(url)")
      .eq("status", "approved")
      .gte("created_at", since);

    if (criteria.make) query = query.eq("make", criteria.make);
    if (criteria.model) query = query.ilike("model", `%${criteria.model}%`);
    if (criteria.maxPrice) query = query.lte("price", criteria.maxPrice);
    if (criteria.minYear) query = query.gte("year", criteria.minYear);
    if (criteria.maxYear) query = query.lte("year", criteria.maxYear);

    const { data: matches } = await query.limit(10);

    if (!matches || matches.length === 0) {
      console.log(`  [SKIP] ${email}: no new matches`);
      skipped++;
      continue;
    }

    const html = buildDigestEmail(name ?? "", matches as MatchedListing[]);

    if (dryRun) {
      console.log(`  [DRY] ${email}: ${matches.length} match(es) (${(matches as MatchedListing[]).map(m => `${m.year} ${m.make} ${m.model}`).join(", ")})`);
      sent++;
      continue;
    }

    try {
      await resend!.emails.send({
        from: "EraMarque <notifications@yt-pay.io>",
        to: email,
        subject: `Your weekly EraMarque digest -- ${matches.length} new listing${matches.length !== 1 ? "s" : ""}`,
        html,
      });

      // Update last_alerted_at
      await supabase
        .from("saved_searches")
        .update({ last_alerted_at: new Date().toISOString() })
        .eq("id", search.id);

      console.log(`  [SENT] ${email}: ${matches.length} match(es)`);
      sent++;
    } catch (err) {
      console.error(`  [ERROR] ${email}: ${err instanceof Error ? err.message : err}`);
      errors++;
    }
  }

  console.log(`\nDone. Sent: ${sent}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
