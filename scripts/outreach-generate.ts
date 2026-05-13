/**
 * Outreach Message Generator
 *
 * For scored leads (score >= 5), generates personalized outreach
 * message drafts using language-aware templates.
 *
 * Usage: npx tsx scripts/outreach-generate.ts
 *   --dry-run     Print messages without saving to DB
 *   --min-score N Override minimum score threshold (default: 5)
 */

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const minScoreIdx = args.indexOf("--min-score");
const MIN_SCORE = minScoreIdx >= 0 ? parseInt(args[minScoreIdx + 1], 10) : 5;

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

interface Lead {
  id: string;
  detected_make: string | null;
  detected_model: string | null;
  detected_year: number | null;
  language: string | null;
  source_url: string | null;
  score: number;
  recommended_angle: string | null;
}

type TemplateFn = (lead: Lead) => string;

const templates: Record<string, TemplateFn> = {
  en: (lead) => {
    const car = formatCar(lead);
    return `Hi! I noticed your ${car} -- beautiful car. We're launching EraMarque, a curated marketplace for European classics. During our beta, listing is completely free. Would you be interested? I can help create the listing for you. Best, [Name]`;
  },

  fr: (lead) => {
    const car = formatCar(lead);
    return `Bonjour ! J'ai remarque votre ${car} -- superbe voiture. Nous lancons EraMarque, un marketplace dedie aux classiques europeennes. Pendant notre beta, la mise en vente est entierement gratuite. Seriez-vous interesse(e) ? Je peux vous aider a creer l'annonce. Cordialement, [Name]`;
  },

  de: (lead) => {
    const car = formatCar(lead);
    return `Hallo! Ich habe Ihren ${car} gesehen -- ein tolles Auto. Wir starten EraMarque, einen kuratierten Marktplatz fuer europaeische Klassiker. Waehrend unserer Beta ist das Inserieren komplett kostenlos. Haetten Sie Interesse? Ich kann Ihnen beim Erstellen des Inserats helfen. Beste Gruesse, [Name]`;
  },

  it: (lead) => {
    const car = formatCar(lead);
    return `Ciao! Ho notato la sua ${car} -- bellissima macchina. Stiamo lanciando EraMarque, un marketplace curato per le classiche europee. Durante la nostra beta, l'inserzione e completamente gratuita. Le interesserebbe? Posso aiutarla a creare l'annuncio. Cordiali saluti, [Name]`;
  },

  es: (lead) => {
    const car = formatCar(lead);
    return `Hola! He visto su ${car} -- un coche precioso. Estamos lanzando EraMarque, un marketplace selecto para clasicos europeos. Durante nuestra beta, publicar es completamente gratis. Le interesaria? Puedo ayudarle a crear el anuncio. Saludos, [Name]`;
  },
};

function formatCar(lead: Lead): string {
  const parts = [
    lead.detected_year ? String(lead.detected_year) : null,
    lead.detected_make,
    lead.detected_model,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "classic car";
}

function pickTemplate(language: string | null): TemplateFn {
  const lang = (language ?? "en").toLowerCase().slice(0, 2);
  return templates[lang] ?? templates.en;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Generating outreach for leads with score >= ${MIN_SCORE}${dryRun ? " (DRY RUN)" : ""}...\n`);

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, detected_make, detected_model, detected_year, language, source_url, score, recommended_angle")
    .eq("status", "scored")
    .gte("score", MIN_SCORE)
    .is("outreach_message", null)
    .order("score", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch leads:", error.message);
    process.exit(1);
  }

  if (!leads || leads.length === 0) {
    console.log("No qualifying leads found.");
    return;
  }

  console.log(`Found ${leads.length} lead(s).\n`);

  let generated = 0;
  let errors = 0;

  for (const lead of leads) {
    const template = pickTemplate(lead.language);
    const message = template(lead);

    if (dryRun) {
      console.log(`--- Lead ${lead.id} (score: ${lead.score}, lang: ${lead.language ?? "en"}) ---`);
      console.log(message);
      console.log();
      generated++;
      continue;
    }

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        outreach_message: message,
        outreach_generated_at: new Date().toISOString(),
        status: "outreach_ready",
      })
      .eq("id", lead.id);

    if (updateError) {
      console.error(`  [ERROR] Lead ${lead.id}: ${updateError.message}`);
      errors++;
    } else {
      const car = formatCar(lead);
      console.log(`  [OK] ${car} (score: ${lead.score}) -> ${lead.language ?? "en"}`);
      generated++;
    }
  }

  console.log(`\nDone. Generated: ${generated}, Errors: ${errors}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
