import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Car } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `The Porsche 911 Buyer's Guide — Every Generation Explained | ${siteConfig.name}`,
  description:
    "A comprehensive Porsche 911 buyer's guide covering every generation from the original 901 to the 997. Price ranges, common issues, best buys, and investment potential.",
};

const generations = [
  {
    name: "901/911 (1963-1973)",
    aka: "The Original",
    description:
      "Where it all began. The original 911 established the rear-engined, flat-six formula that defines the car to this day. Early short-wheelbase cars (pre-1969) are the most collectible, with the 1973 Carrera RS 2.7 sitting at the top of virtually every collector's wish list. These cars are light, communicative, and rawly beautiful -- but they're also demanding to drive, with the notorious rear-weight bias that earned the 911 its reputation for tricky handling.",
    price: "\u20ac80,000 - \u20ac300,000+",
    priceNote: "RS models significantly higher",
    issues: [
      "Rust in front wings, battery box area, and rear quarter panels",
      "Timing chain tensioner failure on Sportomatic models",
      "Carburettor synchronisation issues (pre-1973 models)",
      "Cracked cylinder heads from overheating",
      "Fragile Fuchs alloy wheels (check for cracks)",
    ],
  },
  {
    name: "G-Series / Impact Bumper (1974-1989)",
    aka: "The Survivor",
    description:
      "The longest-running 911 generation adapted to US safety regulations with distinctive 'impact bumpers' that initially horrified purists but have since become iconic in their own right. The G-Series spans a remarkable evolution: from the early 2.7-litre cars through the legendary 3.0 SC to the bulletproof 3.2 Carrera. The SC and 3.2 Carrera are widely regarded as the most reliable air-cooled 911s ever built, making them excellent first-time purchases. The Turbo (930) brought forced induction to the masses and remains one of the most thrilling -- and frightening -- driving experiences in the classic car world.",
    price: "\u20ac50,000 - \u20ac180,000",
    priceNote: "930 Turbos from \u20ac120,000; Speedsters from \u20ac200,000+",
    issues: [
      "Timing chain tensioner failure (critical -- replace with updated part)",
      "Valve guide wear on 2.7 CIS engines",
      "Head stud pull-out on early 2.7 Carrera models",
      "Thermal reactor damage on US-spec cars",
      "Rust in kidney areas, door bottoms, and windscreen frame",
    ],
  },
  {
    name: "964 (1989-1994)",
    aka: "The Moderniser",
    description:
      "The 964 brought the 911 into the modern era with coil-spring suspension, ABS, power steering, and available all-wheel drive -- all while retaining the air-cooled flat-six. Many consider the 964 the best blend of classic 911 character and modern usability. The Carrera 4 was the headline act, but the lighter, purer Carrera 2 is the driver's choice. The RS and RS America models are the lightweight specials, stripped of sound deadening and luxury for a purer driving experience.",
    price: "\u20ac65,000 - \u20ac200,000",
    priceNote: "RS models from \u20ac250,000+; Turbo S from \u20ac400,000+",
    issues: [
      "Dual-mass flywheel failure (expensive, around \u20ac3,000-5,000 to replace)",
      "Oil leaks from cylinder base gaskets",
      "Capacitor discharge ignition (CDI) unit failure",
      "Power steering pump leaks",
      "Catalytic converter rattle on later models",
    ],
  },
  {
    name: "993 (1994-1998)",
    aka: "The Last Air-Cooled",
    description:
      "The final air-cooled 911 and, for many enthusiasts, the pinnacle of the breed. The 993 refined everything about the 964: the multi-link rear suspension finally tamed the 911's handling, the revised bodywork is arguably the most beautiful 911 shape, and the VarioRAM engine in the 1996+ models is wonderfully responsive. As the last of its kind, the 993 carries a permanent premium. Values have climbed steadily for over a decade and show no sign of softening. The Turbo, with its twin turbochargers and all-wheel drive, is one of the great supercars of the 1990s.",
    price: "\u20ac80,000 - \u20ac250,000",
    priceNote: "Turbo from \u20ac200,000; GT2 from \u20ac800,000+",
    issues: [
      "Rear main seal (RMS) oil leaks",
      "Hydraulic chain tensioner failure (update to dual-row if not already done)",
      "Heater valve failures",
      "Cracked coolant pipes on Turbo models",
      "Worn suspension bushings (expensive multi-link rear setup)",
    ],
  },
  {
    name: "996 (1998-2004)",
    aka: "The Controversial One",
    description:
      "The first water-cooled 911 divided opinion with its 'fried egg' headlights and shared-platform approach with the Boxster. But beneath the controversy lies a genuinely excellent sports car. The 996 is faster, more refined, and more capable than any air-cooled 911, and it remains the most affordable way into modern 911 ownership. The GT3, introduced in 1999, is a masterpiece -- a track-focused naturally aspirated car that many rate as the best 911 of all time. Early GT3 values have already climbed sharply and are unlikely to come back down.",
    price: "\u20ac25,000 - \u20ac80,000",
    priceNote: "GT3 from \u20ac120,000; Turbo from \u20ac65,000; GT2 from \u20ac300,000+",
    issues: [
      "IMS bearing failure (3.4 and early 3.6 engines -- critical check before purchase)",
      "Bore scoring on later 3.6 engines",
      "Rear main seal leaks",
      "Coolant pipe failures behind the engine",
      "Headlight condensation and yellowing",
    ],
  },
  {
    name: "997 (2004-2012)",
    aka: "The Refined Classic",
    description:
      "The 997 corrected almost everything the purists disliked about the 996: the headlights returned to a traditional round shape, the interior quality improved dramatically, and the driving experience was sharpened across the range. The 997.2 facelift (2009+) introduced direct injection engines that eliminated the IMS bearing concern, making them significantly more reliable. The GT3 RS 4.0, produced in just 600 units, is one of the most collectible modern Porsches. For many buyers, the 997 represents the sweet spot of modern 911 ownership -- old enough to have character, new enough to be genuinely usable.",
    price: "\u20ac40,000 - \u20ac120,000",
    priceNote: "GT3 from \u20ac130,000; GT3 RS 4.0 from \u20ac500,000+",
    issues: [
      "IMS bearing failure on 997.1 models (same M96/M97 engine family as 996)",
      "Bore scoring on 997.1 3.8-litre engines",
      "PASM (active suspension) damper failure",
      "Coolant pipe leaks behind engine",
      "PDK mechatronics issues on early 997.2 models",
    ],
  },
];

export default function Porsche911GuidePage() {
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
            <span className="text-stone-600">Porsche 911 Buyer&apos;s Guide</span>
          </nav>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
              <Car className="size-3" />
              Model Guide
            </span>
            <span className="inline-flex items-center gap-1 text-stone-400">
              <Clock className="size-3" />
              15 min read
            </span>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            The Porsche 911 Buyer&apos;s Guide — Every Generation Explained
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-500">
            No car in history has been so continuously refined while remaining
            so fundamentally unchanged. From Ferdinand &ldquo;Butzi&rdquo;
            Porsche&apos;s original 1963 design to the last naturally aspirated
            997, the 911 has always been a rear-engined, flat-six coupe with
            an unmistakable silhouette. Here&apos;s everything you need to know
            before buying one.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="prose-stone space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Why the 911?
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The Porsche 911 is the benchmark by which all sports cars are
                  measured. It has been in continuous production since 1963 --
                  longer than any other sports car in history -- and every
                  generation has offered a unique balance of daily usability,
                  performance, and that indefinable quality that makes you want
                  to take the long way home.
                </p>
                <p>
                  From an investment perspective, the 911 has one of the
                  strongest track records of any classic car. Values have
                  appreciated across virtually every generation, with
                  air-cooled models in particular showing extraordinary gains
                  over the past decade. Even the once-maligned 996 is now
                  climbing steadily as buyers recognise the driving quality
                  beneath the controversial styling.
                </p>
                <p>
                  The depth of the 911 market is another advantage. There are
                  specialists in every European country, parts availability is
                  excellent (Porsche Classic even remanufactures discontinued
                  components), and the community of owners and enthusiasts is
                  one of the most active and knowledgeable in the automotive
                  world.
                </p>
              </div>
            </section>

            {/* Generations */}
            {generations.map((gen) => (
              <section key={gen.name}>
                <h2 className="font-heading text-2xl font-bold text-stone-900">
                  {gen.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-amber-600">
                  {gen.aka}
                </p>
                <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                  <p>{gen.description}</p>

                  {/* Price box */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-5 py-4">
                    <p className="text-sm font-semibold text-stone-800">
                      Price Range: {gen.price}
                    </p>
                    {gen.priceNote && (
                      <p className="mt-1 text-xs text-stone-500">
                        {gen.priceNote}
                      </p>
                    )}
                  </div>

                  {/* Common issues */}
                  <div>
                    <h3 className="font-heading text-base font-semibold text-stone-800">
                      Common Issues
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {gen.issues.map((issue) => (
                        <li
                          key={issue}
                          className="flex gap-2 text-sm text-stone-600"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-stone-400" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ))}

            {/* Price Guide Table */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Price Guide at a Glance
              </h2>
              <p className="mt-2 text-sm text-stone-500">
                Approximate values for good-condition examples with documented
                history. Prices in EUR, as of early 2026. Special editions,
                low-mileage examples, and concours-quality cars can command
                significant premiums.
              </p>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="py-3 text-left font-semibold text-stone-900">
                        Generation
                      </th>
                      <th className="py-3 text-left font-semibold text-stone-900">
                        Entry
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
                        901/911
                      </td>
                      <td className="py-3">&euro;80,000</td>
                      <td className="py-3">&euro;140,000</td>
                      <td className="py-3">&euro;250,000+</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">
                        G-Series SC
                      </td>
                      <td className="py-3">&euro;50,000</td>
                      <td className="py-3">&euro;75,000</td>
                      <td className="py-3">&euro;110,000</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">
                        G-Series 3.2
                      </td>
                      <td className="py-3">&euro;55,000</td>
                      <td className="py-3">&euro;85,000</td>
                      <td className="py-3">&euro;130,000</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">964</td>
                      <td className="py-3">&euro;65,000</td>
                      <td className="py-3">&euro;95,000</td>
                      <td className="py-3">&euro;160,000</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">993</td>
                      <td className="py-3">&euro;80,000</td>
                      <td className="py-3">&euro;130,000</td>
                      <td className="py-3">&euro;220,000</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">
                        996 Carrera
                      </td>
                      <td className="py-3">&euro;25,000</td>
                      <td className="py-3">&euro;40,000</td>
                      <td className="py-3">&euro;65,000</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 font-medium text-stone-800">
                        997.1 Carrera
                      </td>
                      <td className="py-3">&euro;40,000</td>
                      <td className="py-3">&euro;60,000</td>
                      <td className="py-3">&euro;85,000</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-stone-800">
                        997.2 Carrera
                      </td>
                      <td className="py-3">&euro;55,000</td>
                      <td className="py-3">&euro;75,000</td>
                      <td className="py-3">&euro;110,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Best Buys */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Best Buys
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  <strong>Best value for money:</strong> The 996 Carrera remains
                  the most accessible 911 and offers genuinely outstanding
                  performance. Choose a well-maintained 3.6 manual with IMS
                  bearing already replaced, and you have a car that will thrill
                  you every time you turn the key. As values climb, early entry
                  makes financial sense too.
                </p>
                <p>
                  <strong>Best all-rounder:</strong> The 997.2 Carrera S. With
                  the direct-injection engine (no IMS concerns), a beautiful
                  interior, and performance that still embarrasses many modern
                  sports cars, it&apos;s the 911 that does everything well. Buy a
                  manual for maximum driving pleasure and future value.
                </p>
                <p>
                  <strong>Best investment:</strong> The 993 Carrera S or
                  Carrera 4S with a manual gearbox. As the last air-cooled 911s,
                  these cars occupy a permanent place in Porsche history, and
                  demand consistently outstrips supply. The wide-body Carrera 4S
                  in particular has shown strong, steady appreciation.
                </p>
                <p>
                  <strong>Best first air-cooled 911:</strong> The G-Series 3.2
                  Carrera (1984-1989). Mechanically robust, relatively simple to
                  maintain, and still available at prices that don&apos;t require
                  a second mortgage. The coupe is the purest choice, but the
                  Targa offers open-air motoring with less weather anxiety than
                  the Cabriolet.
                </p>
              </div>
            </section>

            {/* Investment */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Investment Potential
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The 911 market has demonstrated remarkable resilience. Even
                  during the 2020-2022 correction that followed the speculative
                  bubble, values for well-documented, originality-correct
                  examples held firm or experienced only modest softening before
                  resuming their upward trajectory.
                </p>
                <p>
                  The key factors that drive 911 values are{" "}
                  <strong>originality</strong> (matching numbers, original
                  colour, factory options), <strong>documentation</strong>{" "}
                  (complete service history from known specialists), and{" "}
                  <strong>specification</strong> (manual gearbox, desirable
                  colours, sport packages).
                </p>
                <p>
                  Looking ahead, the models most likely to appreciate are
                  the 996 GT3 (increasingly recognised as a landmark car), the
                  997 GT3 RS (the last naturally aspirated RS), and clean,
                  low-mileage 993s. The air-cooled market is mature but
                  continues to inch upward. The water-cooled market is where
                  the growth opportunity lies.
                </p>
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
              href="/guides/buying-your-first-classic"
              className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 transition-all hover:border-stone-300 hover:shadow-sm"
            >
              <div>
                <p className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                  Buying Your First Classic Car
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  A complete guide to budgets, inspections, and avoiding costly
                  mistakes
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-stone-400 group-hover:text-amber-600 transition-colors" />
            </Link>
            <Link
              href="/guides/bmw-e30-m3-guide"
              className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 transition-all hover:border-stone-300 hover:shadow-sm"
            >
              <div>
                <p className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                  BMW E30 M3 Buyer&apos;s Guide
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  The ultimate driving machine -- variants, prices, and what to
                  check
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
                  Where values are heading and which models to watch
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
            Find Your 911
          </h2>
          <p className="mt-4 text-stone-400">
            Browse Porsche 911s currently listed on {siteConfig.name}, from
            air-cooled icons to modern classics.
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
              Sell Your Porsche
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
