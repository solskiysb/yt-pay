import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Clock, BookOpen, CheckCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Buying Your First Classic Car — A Complete Guide | ${siteConfig.name}`,
  description:
    "Everything you need to know before buying your first classic car. Budget advice, inspection checklists, negotiation tips, and common mistakes to avoid.",
};

export default function BuyingFirstClassicPage() {
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
            <span className="text-stone-600">Buying Your First Classic</span>
          </nav>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
              <BookOpen className="size-3" />
              Buying Guide
            </span>
            <span className="inline-flex items-center gap-1 text-stone-400">
              <Clock className="size-3" />
              12 min read
            </span>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Buying Your First Classic Car — A Complete Guide
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-500">
            The classic car market can be thrilling and intimidating in equal
            measure. This guide walks you through everything -- from setting a
            realistic budget to closing the deal -- so your first purchase is a
            joy, not a regret.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="prose-stone space-y-12">
            {/* Section 1 */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Why Buy a Classic Car?
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Modern cars are brilliant appliances. They start every morning,
                  they park themselves, and they&apos;ll coddle you with heated
                  seats and adaptive cruise control. But they rarely make you
                  feel anything. A classic car is different. It demands your
                  attention, rewards your skill, and connects you to the road in
                  ways no modern car can replicate.
                </p>
                <p>
                  Beyond the driving experience, classics offer something
                  increasingly rare in a world of depreciating assets: the
                  potential to hold or even increase in value. While not every
                  old car is an investment, the right purchase at the right price
                  can be one of the few possessions that doesn&apos;t lose money
                  over time.
                </p>
                <p>
                  Then there&apos;s the community. Classic car ownership opens
                  the door to a world of rallies, concours events, Sunday
                  morning drives, and conversations with fellow enthusiasts who
                  share your appreciation for automotive history.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Setting Your Budget
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The purchase price is only part of the equation. A realistic
                  classic car budget includes the car itself, any immediate
                  repairs, insurance, storage, and an annual maintenance fund.
                  As a general rule, budget 10-15% of the purchase price per
                  year for upkeep on an older classic, and 5-8% for a younger
                  one.
                </p>
                <p>
                  For first-time buyers, the <strong>youngtimer sweet spot</strong>{" "}
                  typically falls between <strong>&euro;15,000 and &euro;80,000</strong>.
                  This range covers late-1980s to early-2000s cars that are
                  mechanically robust enough for regular use, simple enough to
                  maintain without specialist tools, and old enough to have
                  character -- think early Porsche Boxsters, BMW E36 M3s,
                  Mercedes W124 coupes, or Alfa Romeo GTVs.
                </p>
                <p>
                  Below &euro;15,000, you&apos;re often buying problems.
                  Above &euro;80,000, you&apos;re entering territory where
                  mistakes become very expensive. That middle ground gives you
                  access to genuinely great cars with a margin of safety.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                What to Look For
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The three pillars of classic car value are{" "}
                  <strong>condition</strong>, <strong>history</strong>, and{" "}
                  <strong>originality</strong>. A car that excels in all three
                  will always command a premium, and will always be easier to
                  sell when the time comes.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Condition
                </h3>
                <p>
                  Bodywork is the most expensive thing to restore. Rust repair,
                  paint, and panel replacement can easily exceed the value of
                  the car. Mechanical components -- engines, gearboxes,
                  suspension -- are generally cheaper and more predictable to
                  rebuild. Always prioritise a sound body over a tired engine.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  History
                </h3>
                <p>
                  A comprehensive service history isn&apos;t just a folder of
                  receipts -- it&apos;s proof that someone cared enough to
                  maintain the car properly. Look for a consistent record from
                  known specialists, stamped service books, and MOT/TUV
                  certificates that show the mileage story is plausible.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Matching Numbers
                </h3>
                <p>
                  &ldquo;Matching numbers&rdquo; means the major components
                  (engine, gearbox, and sometimes the body) carry serial numbers
                  that correspond to the car&apos;s build sheet. For
                  collectible models, matching numbers can represent a 20-40%
                  premium over otherwise identical cars with replacement
                  components.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Pre-Purchase Inspection Checklist
              </h2>
              <div className="mt-4 space-y-3 text-stone-600 leading-relaxed">
                <p>
                  Never skip a professional inspection, even if you consider
                  yourself knowledgeable. A fresh pair of expert eyes will catch
                  things enthusiasm blinds you to. That said, here&apos;s what
                  to check yourself before committing to a specialist
                  inspection:
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Walk around slowly in daylight -- look for paint colour variations, uneven panel gaps, and signs of filler",
                    "Check every drain channel and sill for rust -- poke gently with a finger, not a screwdriver",
                    "Open and close every door, the boot, and the bonnet -- they should align and latch smoothly",
                    "Start the engine from cold and listen for unusual noises in the first 30 seconds",
                    "Check the oil -- milky residue suggests head gasket issues; metallic particles suggest internal wear",
                    "Test every electrical component: lights, wipers, gauges, windows, locks",
                    "Drive it for at least 20 minutes, including motorway speeds and tight turns",
                    "Check the underside on a lift or over a pit -- look for structural rust, oil leaks, and bodged repairs",
                    "Verify the VIN matches the registration document and the plates on the car",
                    "Ask for all keys, remotes, and any spare parts the seller has",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Negotiation Tips
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Classic car negotiation is part art, part preparation. The
                  seller has likely spent years with the car and may have an
                  emotional attachment that inflates their asking price. Your job
                  is to be informed, respectful, and patient.
                </p>
                <p>
                  <strong>Research comparable sales.</strong> Use recent auction
                  results and classified listings to establish a fair market
                  value. Present these when making your offer -- it turns the
                  conversation from opinion into evidence.
                </p>
                <p>
                  <strong>Itemise the work needed.</strong> If the inspection
                  reveals issues, get estimates from specialists. A &euro;3,000
                  suspension rebuild is a fact-based reason to adjust the price,
                  not a criticism of the car.
                </p>
                <p>
                  <strong>Be prepared to walk away.</strong> The classic car
                  market rewards patience. There will always be another car.
                  Desperation is the most expensive emotion in this hobby.
                </p>
                <p>
                  <strong>Close quickly when it&apos;s right.</strong>{" "}
                  Conversely, if a car is fairly priced and checks out, don&apos;t
                  negotiate for the sake of it. Good cars at fair prices don&apos;t
                  last long, and a reputation as a serious buyer opens doors to
                  off-market opportunities.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Import & Export Considerations in Europe
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Buying across borders within the EU is increasingly common and
                  generally straightforward, but there are nuances worth
                  understanding.
                </p>
                <p>
                  <strong>VAT:</strong> Within the EU, private sales between
                  individuals are typically VAT-exempt. However, buying from a
                  dealer in another EU country may involve reverse-charge VAT
                  rules. If importing from outside the EU (UK post-Brexit,
                  Switzerland, USA), you&apos;ll pay import duty (typically
                  6.5% for vehicles) plus your country&apos;s VAT rate on the
                  customs value.
                </p>
                <p>
                  <strong>Registration:</strong> Each country has its own
                  process for registering a foreign vehicle. In Germany, you&apos;ll
                  need a TUV inspection. In France, it&apos;s the DRIRE process.
                  In Italy, the Motorizzazione Civile handles it. Budget 2-6
                  weeks and &euro;500-1,500 for the re-registration process.
                </p>
                <p>
                  <strong>Transport:</strong> Enclosed transport across Europe
                  typically costs &euro;500-1,500 depending on distance. Open
                  transport is cheaper but exposes the car to weather and road
                  debris. For high-value purchases, enclosed is always worth the
                  premium.
                </p>
                <p>
                  <strong>Historic vehicle status:</strong> Many European
                  countries offer favourable tax and inspection regimes for
                  vehicles over 30 years old. This can significantly reduce the
                  annual cost of ownership and is worth investigating before you
                  buy.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Insurance and Registration
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Classic car insurance is typically cheaper than standard
                  cover, but it comes with conditions. Most agreed-value
                  policies require the car to be stored in a garage, limit
                  annual mileage (typically 3,000-10,000 km), and restrict
                  use to leisure only -- no commuting.
                </p>
                <p>
                  <strong>Agreed value vs. market value:</strong> Always insist
                  on an agreed-value policy. This means the insurer and you
                  agree on the car&apos;s value upfront, and that&apos;s what
                  they&apos;ll pay in the event of a total loss. Market-value
                  policies can leave you dramatically underinsured if the
                  classic car market has moved since you bought the policy.
                </p>
                <p>
                  Specialist classic car insurers like Hagerty, Adrian Flux,
                  and Zurich Classic offer policies tailored to enthusiast
                  ownership. Premiums for a &euro;30,000 classic typically range
                  from &euro;200-600 per year depending on the driver, the car,
                  and the country.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Common Mistakes to Avoid
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  After years of watching buyers enter the classic car market,
                  these are the mistakes we see most often:
                </p>
                <p>
                  <strong>Buying with your heart, not your head.</strong> Fall in
                  love with the car, but let the data make the decision. The
                  prettiest car in the classifieds is often hiding the most
                  expensive problems.
                </p>
                <p>
                  <strong>Underestimating restoration costs.</strong> Whatever
                  you think a restoration will cost, double it and add 20%.
                  This isn&apos;t cynicism -- it&apos;s the accumulated wisdom of
                  every person who has ever stripped a classic car to bare metal.
                  Unless you&apos;re an experienced restorer, buy the best
                  example you can afford, not a project.
                </p>
                <p>
                  <strong>Skipping the pre-purchase inspection.</strong> A
                  professional inspection costs &euro;200-500. The issues it
                  uncovers can save you thousands. There is no scenario where
                  skipping it makes financial sense.
                </p>
                <p>
                  <strong>Ignoring running costs.</strong> A &euro;25,000 Jaguar
                  XJS is cheap to buy. Maintaining it to a high standard is
                  not. Research parts availability, specialist labour rates, and
                  typical failure points before you commit.
                </p>
                <p>
                  <strong>Buying the cheapest example.</strong> In the classic
                  car world, cheap cars are almost never good value. The
                  difference between a &euro;15,000 example and a &euro;22,000
                  example of the same car is often &euro;15,000 worth of deferred
                  maintenance and hidden problems.
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
              href="/guides/bmw-e30-m3-guide"
              className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-5 py-4 transition-all hover:border-stone-300 hover:shadow-sm"
            >
              <div>
                <p className="font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                  BMW E30 M3 Buyer&apos;s Guide
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  The legendary homologation special -- variants, prices, and
                  what to check
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
            Ready to Start Looking?
          </h2>
          <p className="mt-4 text-stone-400">
            Browse our curated collection of classic and beautiful cars from
            sellers across Europe.
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
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
