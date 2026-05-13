/**
 * Seed 20 priority car models for SEO/marketing pages.
 *
 * Usage: npx tsx scripts/seed-models.ts
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
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const models = [
  { make: "BMW", model: "E30", generation: "E30", years: "1982-1994", slug: "bmw-e30", priority: 1 },
  { make: "BMW", model: "E36 M3", generation: "E36", years: "1992-1999", slug: "bmw-e36-m3", priority: 2 },
  { make: "Porsche", model: "911 (964)", generation: "964", years: "1989-1994", slug: "porsche-911-964", priority: 1 },
  { make: "Porsche", model: "911 (993)", generation: "993", years: "1994-1998", slug: "porsche-911-993", priority: 1 },
  { make: "Porsche", model: "944", generation: "944", years: "1982-1991", slug: "porsche-944", priority: 2 },
  { make: "Mercedes-Benz", model: "W124", generation: "W124", years: "1984-1997", slug: "mercedes-w124", priority: 1 },
  { make: "Mercedes-Benz", model: "R129 SL", generation: "R129", years: "1989-2001", slug: "mercedes-r129", priority: 2 },
  { make: "Peugeot", model: "205 GTI", generation: "205", years: "1984-1994", slug: "peugeot-205-gti", priority: 1 },
  { make: "Volkswagen", model: "Golf GTI Mk1", generation: "Mk1", years: "1976-1983", slug: "vw-golf-gti-mk1", priority: 2 },
  { make: "Volkswagen", model: "Golf GTI Mk2", generation: "Mk2", years: "1983-1992", slug: "vw-golf-gti-mk2", priority: 2 },
  { make: "Alfa Romeo", model: "Spider", generation: "115/916", years: "1966-2005", slug: "alfa-romeo-spider", priority: 2 },
  { make: "Alfa Romeo", model: "GTV", generation: "916", years: "1995-2006", slug: "alfa-romeo-gtv", priority: 3 },
  { make: "Jaguar", model: "XJS", generation: "XJS", years: "1975-1996", slug: "jaguar-xjs", priority: 3 },
  { make: "Volvo", model: "240", generation: "240", years: "1974-1993", slug: "volvo-240", priority: 3 },
  { make: "Saab", model: "900 Turbo", generation: "900", years: "1978-1998", slug: "saab-900-turbo", priority: 3 },
  { make: "Lancia", model: "Delta Integrale", generation: "Delta", years: "1979-1994", slug: "lancia-delta-integrale", priority: 2 },
  { make: "Renault", model: "Alpine A110", generation: "A110", years: "1961-1977", slug: "renault-alpine-a110", priority: 3 },
  { make: "Fiat", model: "124 Spider", generation: "124", years: "1966-1985", slug: "fiat-124-spider", priority: 3 },
  { make: "Audi", model: "Quattro", generation: "Ur-Quattro", years: "1980-1991", slug: "audi-quattro", priority: 3 },
  { make: "Ford", model: "Escort RS", generation: "RS", years: "1970-1998", slug: "ford-escort-rs", priority: 3 },
];

async function main() {
  console.log(`Seeding ${models.length} priority models...`);

  const { data, error } = await supabase
    .from("models")
    .upsert(models, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Error seeding models:", error);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} models.`);
  data.forEach((m) => console.log(`  - ${m.make} ${m.model} (${m.slug})`));
}

main();
