import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Car, CheckCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `BMW E30 M3 Buyer's Guide — The Ultimate Driving Machine | ${siteConfig.name}`,
  description:
    "Complete BMW E30 M3 buyer's guide. Variants, what to look for, price guide, maintenance tips, and why this homologation special became a legend.",
};

const variants = [
  {
    name: "Standard E30 M3 (1986-1990)",
    production: "~17,970 units",
    description:
      "The base model, if you can call a Group A homologation special 'base'. Powered by the S14 2.3-litre four-cylinder engine producing 200 hp (215 hp with catalyst in later models), it was developed directly from BMW Motorsport's touring car programme. Every E30 M3 was hand-assembled at BMW's Garching facility, with each S14 engine individually bench-tested before installation. The dog-leg first gear pattern of the Getrag 265 gearbox is a distinctive feature that takes some adjustment for new owners but quickly becomes second nature.",
  },
  {
    name: "Sport Evolution (1990)",
    production: "600 units",
    description:
      "The ultimate road-going E30 M3. The Sport Evolution received a bored-out 2.5-litre S14 producing 238 hp, a revised front bumper with adjustable splitter, a more aggressive rear spoiler, and thinner glass to reduce weight. Each car came with a certificate of authenticity signed by the BMW Motorsport director. The Sport Evolution is the most collectible variant and commands a significant premium, with values regularly exceeding \u20ac200,000 for excellent examples.",
  },
  {
    name: "Europameister (1988)",
    production: "148 units",
    description:
      "Created to celebrate Roberto Ravaglia's 1987 World Touring Car Championship victory, the Europameister was available exclusively in Nogaro Silver with anthracite Recaro sport seats. Mechanically identical to the standard M3 but distinguished by its unique colour combination, numbered plaque, and Europameister script on the rear panel. The limited production numbers and racing heritage make it highly sought after by collectors.",
  },
  {
    name: "Cecotto Edition (1989)",
    production: "505 units",
    description:
      "Named after Venezuelan racing driver Johnny Cecotto, who drove an M3 in the DTM. Available in Misano Red or Macao Blue metallic, with special interior trim and unique 15-spoke BBS wheels. Like the Europameister, the Cecotto is mechanically standard but commands a premium for its limited numbers and distinctive specification. Macao Blue examples are particularly sought after.",
  },
  {
    name: "Convertible (1988-1991)",
    production: "786 units",
    description:
      "The rarest body style of the E30 M3, produced in very limited numbers. The convertible received additional structural bracing to compensate for the loss of the roof, adding roughly 100 kg to the kerb weight. While it lacks the raw edge of the coupe, the convertible M3 is a genuine rarity and values have climbed sharply in recent years, often exceeding coupe prices despite the purists' preference for the fixed-roof car.",
  },
];

export default function BMWE30M3GuidePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-stone-400">
            <Link
              href="/guides"
              className="transition-colors hover:text-stone-600"
            >
              Guides
            </Link>
            <span>/</span>
            <span className="text-stone-600">BMW E30 M3</span>
          </nav>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
              <Car className="size-3" />
              Model Guide
            </span>
            <span className="inline-flex items-center gap-1 text-stone-400">
              <Clock className="size-3" />
              10 min read
            </span>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            BMW E30 M3 — The Ultimate Driving Machine Buyer&apos;s Guide
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-500">
            Born to homologate BMW&apos;s Group A touring car, the E30 M3
            became one of the most celebrated sports cars of the 1980s. With
            fewer than 18,000 coupes produced and values climbing steadily,
            here&apos;s everything you need to know before buying one.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="prose-stone space-y-12">
            {/* Why Legendary */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Why the E30 M3 Is Legendary
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  In 1985, BMW needed to homologate a car for Group A touring
                  car racing. The rules required 5,000 road cars to be produced,
                  and rather than simply adding a spoiler to a standard 3 Series,
                  BMW Motorsport created something extraordinary: a car with 12
                  body panels unique to the M3, a hand-built four-cylinder
                  engine derived from the M1 supercar&apos;s powerplant, and a
                  chassis tuned to a level of precision that embarrassed cars
                  costing twice as much.
                </p>
                <p>
                  On the track, the E30 M3 dominated. It won the DTM
                  championship, the European Touring Car Championship, the World
                  Touring Car Championship, and countless national series.
                  Between 1987 and 1992, it was virtually unbeatable in any
                  form of tin-top racing.
                </p>
                <p>
                  On the road, the E30 M3 was equally remarkable. The S14
                  engine, while producing modest power by today&apos;s standards,
                  was responsive, rev-happy, and accompanied by an exhaust note
                  that remains one of the most evocative sounds in the BMW
                  catalogue. The chassis was balanced to near perfection --
                  neutral and communicative, with steering feel that modern M
                  cars can only dream of replicating.
                </p>
                <p>
                  Today, the E30 M3 occupies a position similar to the
                  air-cooled Porsche 911: a car whose reputation, racing
                  heritage, and limited production numbers have created
                  persistent, growing demand. It is, by any reasonable measure,
                  one of the greatest sports cars ever built.
                </p>
              </div>
            </section>

            {/* Variants */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Variants
              </h2>
              <div className="mt-6 space-y-8">
                {variants.map((v) => (
                  <div key={v.name}>
                    <h3 className="font-heading text-lg font-semibold text-stone-800">
                      {v.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-amber-600">
                      Production: {v.production}
                    </p>
                    <p className="mt-3 text-stone-600 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* What to Look For */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                What to Look For
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The E30 M3 is a well-engineered car, but it&apos;s also 35+
                  years old. Understanding the common failure points and
                  originality markers is essential before purchasing.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Body and Structure
                </h3>
                <p>
                  Rust is the E30 M3&apos;s primary enemy. Check the front
                  inner wings, the jacking points, the rear wheel arches, and
                  the area around the rear window. The M3-specific box flares
                  trap moisture and can rot from the inside out. Lift the
                  carpets and check the floor pans, particularly under the
                  rear seats. Any structural rust should be addressed by a
                  specialist -- bodge repairs on a car of this value are
                  unacceptable.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Engine (S14)
                </h3>
                <p>
                  The S14 is a strong, rev-happy engine that will happily cover
                  200,000+ km if properly maintained. Listen for timing chain
                  rattle on cold start (the chain and tensioner should be
                  replaced every 100,000 km), check for oil leaks around the
                  valve cover and oil pan, and ensure the oil pressure gauge
                  reads correctly at idle and under load. The S14 should pull
                  cleanly to its 7,000 rpm redline without hesitation or smoke.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Drivetrain
                </h3>
                <p>
                  The Getrag 265 five-speed gearbox is robust but check for
                  notchy shifts, particularly into second gear. The limited-slip
                  differential should engage smoothly under power -- clunking
                  suggests worn internals. Clutch replacement is straightforward
                  but verify the clutch doesn&apos;t slip under hard
                  acceleration in third gear.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Originality
                </h3>
                <p>
                  Verify the car against its original build sheet (available
                  from BMW Classic). Check the engine number stamped on the
                  block against the registration documents. Original paint can
                  be verified with a paint depth gauge -- consistent readings
                  of 100-130 microns across all panels suggest original finish.
                  Repainted panels will typically show 200+ microns.
                </p>
              </div>
            </section>

            {/* Price Guide */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Price Guide
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Approximate values for E30 M3 variants as of early 2026. All
                prices in EUR.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="py-3 text-left font-semibold text-stone-900">
                        Variant
                      </th>
                      <th className="py-3 text-left font-semibold text-stone-900">
                        Project
                      </th>
                      <th className="py-3 text-left font-semibold text-stone-900">
                        Good
                      </th>
                      <th className="py-3 text-left font-semibold text-stone-900">
                        Excellent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-stone-600">
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">
                        Standard Coupe
                      </td>
                      <td className="py-3">&euro;55,000</td>
                      <td className="py-3">&euro;85,000</td>
                      <td className="py-3">&euro;120,000</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">
                        Cecotto / Europameister
                      </td>
                      <td className="py-3">&euro;80,000</td>
                      <td className="py-3">&euro;110,000</td>
                      <td className="py-3">&euro;150,000</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">
                        Sport Evolution
                      </td>
                      <td className="py-3">&euro;130,000</td>
                      <td className="py-3">&euro;180,000</td>
                      <td className="py-3">&euro;250,000+</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-stone-800">
                        Convertible
                      </td>
                      <td className="py-3">&euro;70,000</td>
                      <td className="py-3">&euro;100,000</td>
                      <td className="py-3">&euro;140,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Maintenance Tips */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Maintenance Tips
              </h2>
              <div className="mt-4 space-y-3 text-stone-600 leading-relaxed">
                <p>
                  The E30 M3 is mechanically straightforward by modern
                  standards, but it demands regular, correct maintenance.
                  Cutting corners on a car of this value is false economy.
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    "Oil changes every 5,000 km with 10W-40 or 15W-50 mineral oil (not synthetic unless the engine has been rebuilt with modern seals)",
                    "Timing chain and tensioner replacement every 100,000 km or 10 years, whichever comes first",
                    "Valve clearance check every 20,000 km -- the S14 uses bucket-and-shim adjustment that requires periodic setting",
                    "Coolant system refresh every 3 years -- replace hoses, thermostat, and water pump preventatively",
                    "Differential oil change every 30,000 km with the correct GL-5 specification fluid",
                    "Inspect all rubber bushings, mounts, and boots annually -- perished rubber degrades handling noticeably",
                    "Store with a battery tender and ideally on axle stands to prevent flat spots on tyres",
                    "Use a specialist who knows the S14 -- generic BMW mechanics may not understand the engine's specific requirements",
                  ].map((tip) => (
                    <div key={tip} className="flex gap-3">
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </article>

      {/* Related Guides */}
      <section className="border-t border-stone-200 bg-stone-50 py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="font-heading text-xl font-bold text-stone-900">
            Related Guides
          </h2>
          <div className="mt-6 space-y-4">
            <Link
              href="/guides/porsche-911-buyers-guide"
              className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 transition-all hover:border-stone-300 hover:shadow-sm"
            >
              <div>
                <p className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                  The Porsche 911 Buyer&apos;s Guide
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Every generation explained with price ranges and common
                  issues
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-stone-400 group-hover:text-amber-600 transition-colors" />
            </Link>
            <Link
              href="/guides/buying-your-first-classic"
              className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 transition-all hover:border-stone-300 hover:shadow-sm"
            >
              <div>
                <p className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                  Buying Your First Classic Car
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  A complete guide to budgets, inspections, and common mistakes
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-stone-400 group-hover:text-amber-600 transition-colors" />
            </Link>
            <Link
              href="/guides/market-trends-2026"
              className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 transition-all hover:border-stone-300 hover:shadow-sm"
            >
              <div>
                <p className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                  Classic Car Market Trends 2026
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Rising stars, best value segments, and youngtimers to watch
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-stone-400 group-hover:text-amber-600 transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Looking for an E30 M3?
          </h2>
          <p className="mt-4 text-stone-400">
            Browse BMW listings on {siteConfig.name} or list your own M3 for
            sale to reach enthusiasts across Europe.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/cars"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-amber-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-amber-400"
            >
              Browse Our Collection
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-stone-700 px-6 text-sm font-medium text-stone-300 transition-colors hover:border-stone-600 hover:text-white"
            >
              Sell Your BMW
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
