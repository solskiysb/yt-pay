/**
 * Social Media Caption Generator
 *
 * Reads approved listings from Supabase and generates
 * platform-specific captions (Instagram, Facebook, X, LinkedIn).
 *
 * Usage: npx tsx scripts/social-generate.ts
 *   --listing <slug>   Generate for a specific listing only
 *   --output <file>    Write JSON output to file (default: stdout)
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { writeFileSync } from "fs";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const listingSlugIdx = args.indexOf("--listing");
const listingSlug = listingSlugIdx >= 0 ? args[listingSlugIdx + 1] : null;
const outputIdx = args.indexOf("--output");
const outputFile = outputIdx >= 0 ? args[outputIdx + 1] : null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface Listing {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  location: string | null;
  engine: string | null;
  short_description: string | null;
  description: string;
  body_type: string | null;
  condition: string | null;
  listing_images: { url: string }[];
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

const SITE_URL = "https://yt-pay.io";

// ---------------------------------------------------------------------------
// Caption generators
// ---------------------------------------------------------------------------

function generateInstagramCaption(l: Listing): string {
  const lines = [
    `${l.year} ${l.make} ${l.model} | ${formatPrice(l.price)}`,
    "",
    l.short_description ?? l.description.slice(0, 140),
    "",
  ];

  if (l.location) lines.push(`Location: ${l.location}`);
  if (l.engine) lines.push(`Engine: ${l.engine}`);
  if (l.mileage) lines.push(`Mileage: ${l.mileage.toLocaleString()} km`);
  lines.push("");
  lines.push("View listing -> link in bio");
  lines.push("");

  const makeTag = l.make.toLowerCase().replace(/[^a-z0-9]/g, "");
  const modelTag = l.model.toLowerCase().replace(/[^a-z0-9]/g, "");
  lines.push(`#classiccar #${makeTag} #${modelTag} #youngtimer #classiccars #eramarque #carsofinstagram #vintagecars`);

  return lines.join("\n");
}

function generateFacebookCaption(l: Listing): string {
  const url = `${SITE_URL}/listings/${l.slug}`;
  const lines = [
    `NEW LISTING: ${l.year} ${l.make} ${l.model} - ${formatPrice(l.price)}`,
    "",
    l.short_description ?? l.description.slice(0, 200),
    "",
  ];

  if (l.location) lines.push(`Location: ${l.location}`);
  if (l.engine) lines.push(`Engine: ${l.engine}`);
  if (l.mileage) lines.push(`Mileage: ${l.mileage.toLocaleString()} km`);
  lines.push("");
  lines.push(`View full listing: ${url}`);
  lines.push("");
  lines.push("#ClassicCars #EraMarque #VintageCars #EuropeanClassics");

  return lines.join("\n");
}

function generateXCaption(l: Listing): string {
  const url = `${SITE_URL}/listings/${l.slug}`;
  const emoji = l.condition === "excellent" ? "Excellent condition." : "";
  // Keep under 280 chars
  const base = `${l.year} ${l.make} ${l.model} | ${formatPrice(l.price)} ${emoji}`.trim();
  const suffix = `\n\n${url}\n\n#ClassicCar #${l.make}`;
  // Truncate description if needed
  const maxDesc = 280 - base.length - suffix.length - 4;
  const desc = maxDesc > 20 ? `\n${(l.short_description ?? "").slice(0, maxDesc)}` : "";
  return `${base}${desc}${suffix}`;
}

function generateLinkedInCaption(l: Listing): string {
  const url = `${SITE_URL}/listings/${l.slug}`;
  const lines = [
    `A ${l.year} ${l.make} ${l.model} just landed on EraMarque.`,
    "",
    l.short_description ?? l.description.slice(0, 200),
    "",
    `Price: ${formatPrice(l.price)}`,
  ];

  if (l.location) lines.push(`Location: ${l.location}`);
  if (l.mileage) lines.push(`Mileage: ${l.mileage.toLocaleString()} km`);
  lines.push("");
  lines.push("We are building a curated marketplace for European classic and retro cars. If you are a collector, enthusiast, or dealer -- check us out.");
  lines.push("");
  lines.push(url);
  lines.push("");
  lines.push("#ClassicCars #Automotive #EraMarque #Collecting");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface SocialOutput {
  listing_slug: string;
  listing_title: string;
  image_url: string | null;
  captions: {
    instagram: string;
    facebook: string;
    x: string;
    linkedin: string;
  };
}

async function main() {
  console.error("Generating social media captions...\n");

  let query = supabase
    .from("listings")
    .select("id, slug, make, model, year, price, mileage, location, engine, short_description, description, body_type, condition, listing_images(url)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (listingSlug) {
    query = query.eq("slug", listingSlug);
  } else {
    query = query.limit(20);
  }

  const { data: listings, error } = await query;

  if (error) {
    console.error("Failed to fetch listings:", error.message);
    process.exit(1);
  }

  if (!listings || listings.length === 0) {
    console.error("No listings found.");
    return;
  }

  console.error(`Found ${listings.length} listing(s).\n`);

  const results: SocialOutput[] = [];

  for (const listing of listings as Listing[]) {
    const output: SocialOutput = {
      listing_slug: listing.slug,
      listing_title: `${listing.year} ${listing.make} ${listing.model}`,
      image_url: listing.listing_images?.[0]?.url ?? null,
      captions: {
        instagram: generateInstagramCaption(listing),
        facebook: generateFacebookCaption(listing),
        x: generateXCaption(listing),
        linkedin: generateLinkedInCaption(listing),
      },
    };

    results.push(output);
    console.error(`  [OK] ${output.listing_title}`);
  }

  const json = JSON.stringify(results, null, 2);

  if (outputFile) {
    writeFileSync(outputFile, json, "utf-8");
    console.error(`\nWritten to ${outputFile}`);
  } else {
    // Captions to stdout, logs to stderr — allows piping
    console.log(json);
  }

  console.error(`\nDone. Generated captions for ${results.length} listing(s).`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
