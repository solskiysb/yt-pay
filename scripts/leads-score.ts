/**
 * Lead Scoring Script
 *
 * Reads unscored leads (status='new') from Supabase,
 * scores them using heuristic rules, and updates the record.
 *
 * Usage: npx tsx scripts/leads-score.ts
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// Heuristic scoring (MVP — no AI API needed)
// ---------------------------------------------------------------------------

interface Lead {
  id: string;
  raw_text: string;
  detected_make: string | null;
  detected_model: string | null;
  source_url: string | null;
  language: string | null;
}

interface ScoringResult {
  score: number;
  ai_summary: string;
  recommended_angle: string;
  signals: string[];
}

function scoreLead(lead: Lead): ScoringResult {
  const text = (lead.raw_text ?? "").toLowerCase();
  let score = 0;
  const signals: string[] = [];

  // Price mention (+2)
  if (/(\d[\d\s.,]*\s*(eur|euro|usd|\$|chf|gbp|kr|sek)|\b\d{4,6}\b\s*(obo|vb|firm|fixe?))/i.test(text) ||
      /price|prix|preis|precio/i.test(text)) {
    score += 2;
    signals.push("price_mentioned");
  }

  // Year / make / model present (+2)
  if (lead.detected_make || lead.detected_model || /\b(19|20)\d{2}\b/.test(text)) {
    score += 2;
    signals.push("vehicle_identified");
  }

  // Selling intent (+3)
  if (/for\s+sale|selling|verkauf|a\s+vendre|en\s+vente|zu\s+verkaufen|vendo|til\s+salg/i.test(text)) {
    score += 3;
    signals.push("selling_intent");
  }

  // Location present (+1)
  if (/\b(france|germany|deutschland|italia|espana|uk|netherlands|belgium|switzerland|austria|sweden|norway|portugal)\b/i.test(text) ||
      lead.raw_text?.match(/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/)) {
    score += 1;
    signals.push("location_present");
  }

  // Contact info present (+1)
  if (/[\w.-]+@[\w.-]+\.\w{2,}/.test(text) ||
      /(\+?\d[\d\s\-()]{7,})/.test(text) ||
      /whatsapp|telegram|signal/i.test(text)) {
    score += 1;
    signals.push("contact_info");
  }

  // Additional signal: mileage mentioned (+1, capped at 10)
  if (/\b\d{1,3}[.,]?\d{3}\s*(km|miles|mi|tkm)\b/i.test(text) ||
      /mileage|kilomet|kilom/i.test(text)) {
    score += 1;
    signals.push("mileage_mentioned");
  }

  score = Math.min(score, 10);

  // Generate summary
  const vehicle = [lead.detected_make, lead.detected_model].filter(Boolean).join(" ") || "unknown vehicle";
  const ai_summary = `Lead for ${vehicle}. Signals: ${signals.join(", ") || "none"}. Score: ${score}/10.`;

  // Recommended outreach angle
  let recommended_angle = "general";
  if (score >= 7) {
    recommended_angle = "direct_offer";
  } else if (score >= 5) {
    recommended_angle = "soft_intro";
  } else {
    recommended_angle = "nurture";
  }

  return { score, ai_summary, recommended_angle, signals };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Fetching unscored leads...");

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, raw_text, detected_make, detected_model, source_url, language")
    .eq("status", "new")
    .limit(100);

  if (error) {
    console.error("Failed to fetch leads:", error.message);
    process.exit(1);
  }

  if (!leads || leads.length === 0) {
    console.log("No unscored leads found.");
    return;
  }

  console.log(`Found ${leads.length} unscored lead(s). Scoring...\n`);

  let scored = 0;
  let errors = 0;

  for (const lead of leads) {
    const result = scoreLead(lead);

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        score: result.score,
        ai_summary: result.ai_summary,
        recommended_angle: result.recommended_angle,
        status: "scored",
        scored_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    if (updateError) {
      console.error(`  [ERROR] Lead ${lead.id}: ${updateError.message}`);
      errors++;
    } else {
      const vehicle = [lead.detected_make, lead.detected_model].filter(Boolean).join(" ") || "?";
      console.log(`  [${result.score}/10] ${vehicle} -> ${result.recommended_angle} (${result.signals.join(", ")})`);
      scored++;
    }
  }

  console.log(`\nDone. Scored: ${scored}, Errors: ${errors}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
