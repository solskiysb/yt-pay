/**
 * Script to convert 5 existing listings into auction listings
 * and seed them with demo bids.
 *
 * Usage: npx tsx scripts/create_auctions.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * in .env or .env.local.
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  // Add random hours for variety
  d.setHours(d.getHours() + Math.floor(Math.random() * 12));
  return d.toISOString();
}

function hoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

interface AuctionConfig {
  startingBid: number;
  reserveMultiplier: number;
  auctionDays: number;
  bidIncrements: number[];
}

const auctionConfigs: AuctionConfig[] = [
  {
    startingBid: 15000,
    reserveMultiplier: 1.5,
    auctionDays: 3,
    bidIncrements: [0, 500, 250, 750, 500],
  },
  {
    startingBid: 25000,
    reserveMultiplier: 1.4,
    auctionDays: 5,
    bidIncrements: [0, 500, 1000, 500],
  },
  {
    startingBid: 45000,
    reserveMultiplier: 1.3,
    auctionDays: 4,
    bidIncrements: [0, 1000, 500, 1500, 1000],
  },
  {
    startingBid: 8000,
    reserveMultiplier: 1.6,
    auctionDays: 6,
    bidIncrements: [0, 200, 100, 300],
  },
  {
    startingBid: 60000,
    reserveMultiplier: 1.25,
    auctionDays: 7,
    bidIncrements: [0, 2000, 1000, 2500, 1500, 3000],
  },
];

async function main() {
  console.log("Fetching approved classified listings...\n");

  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, make, model, year, seller_id")
    .eq("status", "approved")
    .eq("listing_type", "classified")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching listings:", error);
    process.exit(1);
  }

  if (!listings || listings.length === 0) {
    console.error("No approved classified listings found");
    process.exit(1);
  }

  console.log(`Found ${listings.length} listings to convert to auctions.\n`);

  // Get some profile IDs for fake bidders (excluding sellers)
  const sellerIds = [...new Set(listings.map((l) => l.seller_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id")
    .not("id", "in", `(${sellerIds.join(",")})`)
    .limit(10);

  // If we don't have other profiles, we'll use the seller IDs themselves
  // (in production you wouldn't do this, but for demo it's fine)
  const bidderIds =
    profiles && profiles.length > 0
      ? profiles.map((p) => p.id)
      : sellerIds;

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];
    const config = auctionConfigs[i % auctionConfigs.length];

    console.log(
      `Converting: ${listing.year} ${listing.make} ${listing.model} (${listing.id})`
    );

    // Calculate current bid from increments
    let currentBid = config.startingBid;
    const bidAmounts: number[] = [];
    for (const increment of config.bidIncrements) {
      currentBid += increment;
      bidAmounts.push(currentBid);
    }

    const reservePrice = Math.round(
      config.startingBid * config.reserveMultiplier
    );
    const reserveMet = currentBid >= reservePrice;

    // Update listing to auction
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        listing_type: "auction",
        auction_end: daysFromNow(config.auctionDays),
        starting_bid: config.startingBid,
        reserve_price: reservePrice,
        current_bid: currentBid,
        bid_count: bidAmounts.length,
        reserve_met: reserveMet,
      })
      .eq("id", listing.id);

    if (updateError) {
      console.error(`  Error updating listing: ${updateError.message}`);
      continue;
    }

    console.log(
      `  Auction: starting=${config.startingBid}, current=${currentBid}, reserve=${reservePrice} (${reserveMet ? "met" : "not met"}), ends in ${config.auctionDays} days`
    );

    // Insert bids
    const bids = bidAmounts.map((amount, j) => ({
      listing_id: listing.id,
      bidder_id: bidderIds[j % bidderIds.length],
      amount,
      created_at: hoursAgo((bidAmounts.length - j) * 4 + Math.random() * 2),
    }));

    const { error: bidsError } = await supabase.from("bids").insert(bids);

    if (bidsError) {
      console.error(`  Error inserting bids: ${bidsError.message}`);
    } else {
      console.log(`  Inserted ${bids.length} bids`);
    }

    console.log("");
  }

  console.log("Done! Auction listings created successfully.");
}

main().catch(console.error);
