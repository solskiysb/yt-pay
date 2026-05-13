/**
 * Listing Assistant -- AI Listing Creation Helper
 *
 * Reads raw seller text from stdin or a file argument,
 * extracts structured listing data using regex patterns,
 * and outputs JSON with extracted fields + missing field warnings.
 *
 * Usage:
 *   echo "1973 BMW 2002 Tii, 85000 km, Paris, 35000 EUR" | npx tsx scripts/listing-assistant.ts
 *   npx tsx scripts/listing-assistant.ts --file /path/to/description.txt
 *   npx tsx scripts/listing-assistant.ts --text "1973 BMW 2002 Tii, 85000 km..."
 */

import { readFileSync } from "fs";

// ---------------------------------------------------------------------------
// CLI input
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

async function getInput(): Promise<string> {
  const textIdx = args.indexOf("--text");
  if (textIdx >= 0 && args[textIdx + 1]) {
    return args[textIdx + 1];
  }

  const fileIdx = args.indexOf("--file");
  if (fileIdx >= 0 && args[fileIdx + 1]) {
    return readFileSync(args[fileIdx + 1], "utf-8");
  }

  // Read from stdin
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));

    // Timeout after 5 seconds if no input
    setTimeout(() => {
      if (!data) {
        console.error("No input received. Use --text, --file, or pipe text to stdin.");
        process.exit(1);
      }
    }, 5000);
  });
}

// ---------------------------------------------------------------------------
// Known makes and models for matching
// ---------------------------------------------------------------------------

const KNOWN_MAKES: Record<string, string[]> = {
  "Alfa Romeo": ["Giulia", "Spider", "GTV", "Montreal", "Giulietta", "2600", "1750", "Duetto", "33", "75", "155", "156", "164", "GTA"],
  "Aston Martin": ["DB5", "DB6", "DB4", "V8", "Vantage", "DBS", "Volante", "DB7", "Virage"],
  "Audi": ["Quattro", "100", "80", "90", "200", "Coupe", "Sport Quattro", "RS2", "S2"],
  "BMW": ["2002", "E30", "E28", "E24", "E21", "E9", "E12", "Isetta", "M1", "M3", "M5", "M6", "3.0 CSL", "507", "Z1", "Z3", "635CSi", "535i", "325i", "320i"],
  "Citroen": ["DS", "SM", "Traction Avant", "2CV", "CX", "BX", "XM", "Mehari"],
  "Datsun": ["240Z", "260Z", "280Z", "510", "1600", "Fairlady"],
  "Ferrari": ["250", "275", "330", "365", "Dino", "308", "328", "348", "355", "Testarossa", "Mondial", "288 GTO", "F40", "512"],
  "Fiat": ["500", "124", "130", "Dino", "850", "128", "X1/9", "131", "Barchetta"],
  "Ford": ["Mustang", "Capri", "Escort", "Cortina", "GT40", "Sierra", "RS200", "Fiesta XR2"],
  "Jaguar": ["E-Type", "XJ", "XJS", "XK", "Mark II", "XJ6", "XJ12", "XJR", "S-Type", "XK8", "XK120", "XK140", "XK150"],
  "Lancia": ["Delta", "Stratos", "Fulvia", "Flaminia", "Aurelia", "037", "Thema", "Beta"],
  "Lotus": ["Elan", "Europa", "Esprit", "Seven", "Elise", "Carlton", "Elite", "Excel"],
  "Maserati": ["Ghibli", "Bora", "Merak", "Khamsin", "Biturbo", "3200 GT", "Quattroporte", "Shamal"],
  "Mercedes-Benz": ["W113", "W114", "W115", "W116", "W123", "W124", "W126", "W201", "R107", "SL", "SEC", "SEL", "190E", "300SL", "500E", "E500"],
  "MG": ["MGB", "MGA", "Midget", "TD", "TF", "RV8"],
  "Opel": ["GT", "Manta", "Kadett", "Ascona", "Commodore", "Senator"],
  "Peugeot": ["205", "504", "505", "309", "106", "405"],
  "Porsche": ["911", "912", "914", "924", "928", "944", "968", "356", "930", "964", "993", "Boxster", "Carrera", "Turbo", "Targa", "Speedster"],
  "Renault": ["Alpine", "A110", "A310", "R5", "Clio", "4CV", "5 Turbo"],
  "Saab": ["900", "99", "96", "Sonett"],
  "Triumph": ["TR6", "TR4", "TR5", "TR7", "GT6", "Spitfire", "Stag", "Dolomite"],
  "Volkswagen": ["Golf GTI", "Beetle", "Karmann Ghia", "Bus", "Type 2", "Type 3", "Corrado", "Scirocco"],
  "Volvo": ["P1800", "Amazon", "240", "740", "850", "940", "144", "164"],
};

// ---------------------------------------------------------------------------
// Extraction logic
// ---------------------------------------------------------------------------

interface ExtractedListing {
  make: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  currency: string | null;
  mileage: number | null;
  mileage_unit: string | null;
  location: string | null;
  engine: string | null;
  transmission: string | null;
  color: string | null;
  condition: string | null;
  raw_text: string;
  missing_fields: string[];
  confidence: "high" | "medium" | "low";
}

function extractYear(text: string): number | null {
  // Look for 4-digit years between 1920 and 2010
  const matches = text.match(/\b(19[2-9]\d|200\d|2010)\b/g);
  if (matches && matches.length > 0) {
    // Prefer the first year that looks like a car year
    return parseInt(matches[0], 10);
  }
  return null;
}

function extractMakeModel(text: string): { make: string | null; model: string | null } {
  const normalized = text.replace(/[-_]/g, " ");

  for (const [make, models] of Object.entries(KNOWN_MAKES)) {
    const makeRegex = new RegExp(`\\b${make.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (makeRegex.test(normalized)) {
      // Try to find a matching model
      for (const model of models) {
        const modelRegex = new RegExp(`\\b${model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (modelRegex.test(normalized)) {
          return { make, model };
        }
      }
      return { make, model: null };
    }
  }

  // Try common abbreviations
  const abbrevs: Record<string, string> = {
    "merc": "Mercedes-Benz",
    "benz": "Mercedes-Benz",
    "alfa": "Alfa Romeo",
    "vw": "Volkswagen",
    "aston": "Aston Martin",
  };

  for (const [abbrev, make] of Object.entries(abbrevs)) {
    if (new RegExp(`\\b${abbrev}\\b`, "i").test(normalized)) {
      const models = KNOWN_MAKES[make] ?? [];
      for (const model of models) {
        const modelRegex = new RegExp(`\\b${model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (modelRegex.test(normalized)) {
          return { make, model };
        }
      }
      return { make, model: null };
    }
  }

  return { make: null, model: null };
}

function extractPrice(text: string): { price: number | null; currency: string | null } {
  // Patterns: "35,000 EUR", "EUR 35.000", "$45,000", "CHF 28'000"
  const patterns = [
    /(?:EUR|eur)\s*[:\s]?\s*([\d.,'\s]+)/,
    /([\d.,'\s]+)\s*(?:EUR|eur|euros?)/i,
    /(?:USD|\$)\s*([\d.,'\s]+)/,
    /([\d.,'\s]+)\s*(?:USD|dollars?)/i,
    /(?:GBP|gbp)\s*([\d.,'\s]+)/,
    /([\d.,'\s]+)\s*(?:GBP|gbp|pounds?)/i,
    /(?:CHF|chf)\s*([\d.,'\s]+)/,
    /([\d.,'\s]+)\s*(?:CHF|chf)/i,
    /(?:price|prix|preis)[:\s]+\s*([\d.,'\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const raw = match[1].replace(/[\s']/g, "").replace(/,/g, "");
      const num = parseFloat(raw);
      if (num >= 500 && num <= 50_000_000) {
        let currency = "EUR";
        if (/USD|\$|dollars?/i.test(match[0])) currency = "USD";
        else if (/GBP|pounds?/i.test(match[0])) currency = "GBP";
        else if (/CHF/i.test(match[0])) currency = "CHF";
        return { price: num, currency };
      }
    }
  }

  return { price: null, currency: null };
}

function extractMileage(text: string): { mileage: number | null; unit: string | null } {
  const patterns = [
    /([\d.,'\s]+)\s*(?:km|kilometers|kilometres)/i,
    /([\d.,'\s]+)\s*(?:miles|mi)\b/i,
    /(?:mileage|kilomet|kilom)[:\s]+\s*([\d.,'\s]+)/i,
    /([\d.,'\s]+)\s*tkm/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let raw = match[1].replace(/[\s']/g, "").replace(/,/g, "");
      let num = parseFloat(raw);
      if (/tkm/i.test(match[0])) num *= 1000;
      if (num >= 100 && num <= 999_999) {
        const unit = /miles|mi\b/i.test(match[0]) ? "miles" : "km";
        return { mileage: Math.round(num), unit };
      }
    }
  }

  return { mileage: null, unit: null };
}

function extractLocation(text: string): string | null {
  // Country detection
  const countries = [
    "France", "Germany", "Deutschland", "Italy", "Italia", "Spain", "Espana",
    "UK", "United Kingdom", "England", "Netherlands", "Belgium", "Belgique",
    "Switzerland", "Suisse", "Schweiz", "Austria", "Sweden", "Norway",
    "Denmark", "Portugal", "Finland", "Ireland", "Poland", "Czech Republic",
  ];

  for (const country of countries) {
    const regex = new RegExp(`\\b${country}\\b`, "i");
    if (regex.test(text)) {
      // Try to find city before country (skip filler words like "in", "near")
      const cityMatch = text.match(new RegExp(`([A-Z][a-z]{2,}(?:\\s[A-Z][a-z]+)?),?\\s*${country}`, "i"));
      return cityMatch ? `${cityMatch[1]}, ${country}` : country;
    }
  }

  // City patterns with comma
  const cityPattern = text.match(/\b([A-Z][a-z]{2,}(?:\s[A-Z][a-z]+)?),\s*([A-Z]{2})\b/);
  if (cityPattern) return `${cityPattern[1]}, ${cityPattern[2]}`;

  return null;
}

function extractEngine(text: string): string | null {
  // "2.0L", "3.5 litre", "inline-6", "V8", "flat-4"
  const patterns = [
    /(\d+\.?\d*)\s*(?:L|litre|liter)\s*(inline|straight|flat|V|boxer)?[\s-]*(\d)?/i,
    /\b(inline|straight|flat|V|boxer)[\s-]?(\d{1,2})\b/i,
    /\b(V[\s-]?\d{1,2})\b/i,
    /\b(\d{3,4})\s*cc\b/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }

  return null;
}

function extractTransmission(text: string): string | null {
  if (/\b(manual|5[\s-]speed|4[\s-]speed|6[\s-]speed|stick\s*shift)\b/i.test(text)) return "Manual";
  if (/\b(auto(?:matic)?|tiptronic|PDK|DSG|CVT)\b/i.test(text)) return "Automatic";
  return null;
}

function extractColor(text: string): string | null {
  const colors = [
    "white", "black", "silver", "grey", "gray", "red", "blue", "green",
    "yellow", "orange", "brown", "beige", "burgundy", "maroon", "gold",
    "bronze", "cream", "ivory", "navy", "racing green", "british racing green",
    "rosso", "bianco", "nero", "argento", "azzurro", "giallo",
    "weiss", "schwarz", "silber", "rot", "blau", "grun",
    "blanc", "noir", "gris", "rouge", "bleu", "vert", "jaune",
  ];

  const text_lower = text.toLowerCase();
  for (const color of colors) {
    if (text_lower.includes(color)) {
      return color.charAt(0).toUpperCase() + color.slice(1);
    }
  }

  return null;
}

function extractCondition(text: string): string | null {
  if (/\b(excellent|pristine|concours|mint|perfect|showroom)\b/i.test(text)) return "excellent";
  if (/\b(good|well[\s-]maintained|solid|nice|clean)\b/i.test(text)) return "good";
  if (/\b(fair|project|barn[\s-]find|needs\s+work|restoration|rough)\b/i.test(text)) return "fair";
  return null;
}

function extractAll(text: string): ExtractedListing {
  const { make, model } = extractMakeModel(text);
  const year = extractYear(text);
  const { price, currency } = extractPrice(text);
  const { mileage, unit } = extractMileage(text);
  const location = extractLocation(text);
  const engine = extractEngine(text);
  const transmission = extractTransmission(text);
  const color = extractColor(text);
  const condition = extractCondition(text);

  const missing: string[] = [];
  if (!make) missing.push("make");
  if (!model) missing.push("model");
  if (!year) missing.push("year");
  if (!price) missing.push("price");
  if (!mileage) missing.push("mileage");
  if (!location) missing.push("location");

  let confidence: "high" | "medium" | "low" = "low";
  if (missing.length === 0) confidence = "high";
  else if (missing.length <= 2) confidence = "medium";

  return {
    make,
    model,
    year,
    price,
    currency,
    mileage,
    mileage_unit: unit,
    location,
    engine,
    transmission,
    color,
    condition,
    raw_text: text.trim(),
    missing_fields: missing,
    confidence,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const input = await getInput();

  if (!input.trim()) {
    console.error("Empty input. Provide text via --text, --file, or stdin.");
    process.exit(1);
  }

  const result = extractAll(input);

  console.log(JSON.stringify(result, null, 2));

  // Print summary to stderr
  console.error("");
  console.error(`Confidence: ${result.confidence.toUpperCase()}`);
  if (result.missing_fields.length > 0) {
    console.error(`Missing fields: ${result.missing_fields.join(", ")}`);
  }
  if (result.make && result.model && result.year) {
    console.error(`Detected: ${result.year} ${result.make} ${result.model}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
