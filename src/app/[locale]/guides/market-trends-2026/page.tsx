import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: `Classic Car Market Trends 2026 | ${siteConfig.name}`,
  description:
    "Where the classic car market is heading in 2026. Rising stars, best value segments, youngtimers to watch, and European vs global market dynamics.",
};

export default function MarketTrends2026Page() {
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
            <span className="text-stone-600">Market Trends 2026</span>
          </nav>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
              <TrendingUp className="size-3" />
              Market Insights
            </span>
            <span className="inline-flex items-center gap-1 text-stone-400">
              <Clock className="size-3" />
              8 min read
            </span>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
            Classic Car Market Trends 2026
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-stone-500">
            After the correction of 2023-2024, the classic car market is
            finding its footing again. Here&apos;s where values are heading,
            which models are gaining momentum, and where the smartest money is
            going this year.
          </p>
        </div>
      </section>

      {/* Article */}
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="prose-stone space-y-12">
            {/* Market Overview */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Market Overview
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The classic car market in 2026 is characterised by selective
                  recovery. After the speculative excess of 2021-2022 -- when
                  pandemic savings and low interest rates drove some segments to
                  unsustainable levels -- the market corrected through 2023 and
                  2024. The cars that fell the hardest were those that had risen
                  the fastest on speculation rather than genuine enthusiast
                  demand.
                </p>
                <p>
                  What&apos;s emerging now is a healthier market where quality
                  trumps hype. The best cars -- those with impeccable provenance,
                  documented history, and originality -- have held their value
                  or continued to appreciate throughout the correction. Mid-range
                  and lower-tier examples are where the softening occurred, and
                  that&apos;s creating opportunities for informed buyers.
                </p>
                <p>
                  Several macro trends are shaping the market: the generational
                  shift in collector demographics (Gen X buyers now dominate),
                  the growing acceptance of water-cooled and modern classics,
                  increasing focus on usability over concours perfection, and
                  the slow but certain impact of electrification on the broader
                  automotive landscape -- which is, counterintuitively, making
                  combustion-engined classics more desirable, not less.
                </p>
              </div>
            </section>

            {/* Rising Stars */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Rising Stars: Models Gaining Value
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  These are the models showing the strongest upward momentum
                  heading into 2026:
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Porsche 996 GT3 / GT3 RS
                </h3>
                <p>
                  Long overshadowed by the 997 GT3 and dismissed for its 996
                  styling, the original GT3 is finally getting the recognition
                  it deserves. The Mezger engine (shared with the Turbo, not the
                  standard 996) eliminates IMS concerns, and the raw, analogue
                  driving experience is increasingly valued as modern cars become
                  more isolated. Values have climbed 25-30% in the past 18
                  months, and the trajectory looks strong.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Mercedes-Benz W124 E500 / 500E
                </h3>
                <p>
                  The Porsche-assembled super-sedan has been quietly
                  appreciating for years, but 2025-2026 has seen acceleration.
                  Good examples have crossed the &euro;50,000 barrier, and
                  exceptional cars are approaching &euro;80,000. The combination
                  of the M119 V8, bespoke Porsche assembly, and understated
                  elegance resonates strongly with today&apos;s collectors.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  BMW E46 M3 (especially CSL)
                </h3>
                <p>
                  The E46 M3 has officially graduated from &ldquo;used car&rdquo;
                  to &ldquo;modern classic&rdquo;. The naturally aspirated S54
                  engine, rear-wheel drive, and available manual gearbox are
                  exactly the formula that today&apos;s market values most. The
                  CSL, with its carbon roof and 360 hp, has crossed
                  &euro;100,000 for the best examples and shows no signs of
                  slowing.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Alfa Romeo GTV6 / SZ
                </h3>
                <p>
                  Italian classics have lagged behind their German counterparts
                  for years, but the gap is closing. The Busso V6 GTV is
                  increasingly appreciated for its gorgeous engine note and
                  Giugiaro styling, while the brutalist SZ &ldquo;Il
                  Mostro&rdquo; has become a design icon. Both offer
                  extraordinary value relative to their German competitors.
                </p>

                <h3 className="font-heading text-lg font-semibold text-stone-800 pt-2">
                  Lancia Delta HF Integrale
                </h3>
                <p>
                  The rally legend continues its ascent. Clean, rust-free
                  Evoluzione models now comfortably exceed &euro;80,000, and the
                  best are approaching &euro;120,000. The Integrale benefits
                  from a passionate, almost fanatical ownership community and
                  a motorsport pedigree that no other road car can match -- six
                  consecutive World Rally Championship constructors&apos; titles.
                </p>
              </div>
            </section>

            {/* Best Value */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Best Value Segments
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  For buyers looking to enter the classic car market without
                  overpaying, these segments offer the best balance of quality,
                  enjoyment, and value:
                </p>
                <p>
                  <strong>1990s Japanese sports cars</strong> remain
                  undervalued relative to their European equivalents. A Honda
                  S2000, Mazda RX-7 FD, or Toyota Supra (non-Turbo) can be
                  bought for a fraction of what a comparable Porsche or BMW
                  commands, yet offers equal or superior driving engagement.
                  The challenge is finding unmodified examples -- the tuning
                  culture has consumed many of the best cars.
                </p>
                <p>
                  <strong>British sports cars from the 1960s-70s</strong> --
                  particularly Triumph TR6, MGB GT, and Jensen-Healey -- offer
                  genuine classic car ownership for under &euro;25,000. Parts
                  are widely available, the community is strong, and these cars
                  provide an authentic open-air driving experience that more
                  expensive marques can&apos;t necessarily improve upon.
                </p>
                <p>
                  <strong>French classics</strong> are perennially overlooked.
                  A Peugeot 205 GTI (1.9), Renault 5 GT Turbo, or Citroen DS
                  can be bought for remarkably little money considering their
                  design significance and driving character. The 205 GTI in
                  particular is beginning to attract serious collector interest.
                </p>
              </div>
            </section>

            {/* Youngtimers to Watch */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                Youngtimers to Watch
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The youngtimer segment -- cars from the late 1990s and 2000s
                  that haven&apos;t yet reached full classic status -- is where
                  the smartest buying opportunities exist right now. These are
                  our picks for cars likely to appreciate significantly over the
                  next 3-5 years:
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      car: "Porsche 987 Cayman S (2005-2012)",
                      why: "The mid-engined Porsche many consider the best-handling car the company has ever made. Manual examples under 60,000 km are becoming rare.",
                      price: "\u20ac25,000 - \u20ac45,000",
                    },
                    {
                      car: "BMW E39 M5 (1998-2003)",
                      why: "The naturally aspirated V8 super-saloon. Arguably the most complete M car ever built. Manual gearbox, no turbochargers, sublime chassis balance.",
                      price: "\u20ac25,000 - \u20ac55,000",
                    },
                    {
                      car: "Mercedes-Benz R129 SL (1989-2001)",
                      why: "Over-engineered, beautifully built, and still undervalued. The V8 SL500 is the pick, offering effortless grand touring in one of Mercedes' most handsome shapes.",
                      price: "\u20ac15,000 - \u20ac40,000",
                    },
                    {
                      car: "Audi RS4 B5 Avant (2000-2001)",
                      why: "The twin-turbo V6 estate that started Audi's RS dynasty. Brutal performance, everyday practicality, and a production run of only ~6,000 units.",
                      price: "\u20ac30,000 - \u20ac60,000",
                    },
                    {
                      car: "Maserati GranSport / GranTurismo (2004-2007)",
                      why: "The Ferrari-powered Maserati coupe at Italian supercar prices that start below \u20ac25,000. The sound alone is worth the admission. Maintenance is expensive but predictable.",
                      price: "\u20ac20,000 - \u20ac40,000",
                    },
                  ].map((item) => (
                    <div
                      key={item.car}
                      className="rounded-xl border border-stone-200 bg-stone-50/50 px-5 py-4"
                    >
                      <p className="font-semibold text-stone-900">{item.car}</p>
                      <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                        {item.why}
                      </p>
                      <p className="mt-2 text-sm font-medium text-amber-700">
                        Current range: {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* European vs Global */}
            <section>
              <h2 className="font-heading text-2xl font-bold text-stone-900">
                European Market vs. Global
              </h2>
              <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The European classic car market has traditionally operated
                  somewhat independently from the US and Asian markets, but
                  globalisation is increasing alignment. A few important
                  dynamics for European buyers and sellers to understand:
                </p>
                <p>
                  <strong>US demand drives European prices upward.</strong>{" "}
                  American collectors have long sourced European-specification
                  cars for their originality and driving quality. Left-hand-drive
                  European cars destined for the US market represent a
                  significant portion of high-end sales, and this export demand
                  supports European prices. The current dollar-euro exchange
                  rate makes European cars particularly attractive to US buyers.
                </p>
                <p>
                  <strong>The UK post-Brexit tax differential</strong> has made
                  importing from the UK less straightforward but has also
                  created a price gap. Right-hand-drive examples in the UK
                  often trade at a discount to equivalent left-hand-drive
                  European cars, creating an arbitrage opportunity for buyers
                  willing to navigate the import process and accept a
                  right-hand-drive vehicle.
                </p>
                <p>
                  <strong>German market leads quality premiums.</strong> Germany
                  remains the epicentre of the European classic car market,
                  with the highest concentration of specialists, the most
                  rigorous inspection regimes (TUV), and consequently the
                  highest standards -- and prices -- for top-tier cars.
                  A German-supplied, German-maintained car with full TUV history
                  commands a premium in every international market.
                </p>
                <p>
                  <strong>Southern European cars need extra scrutiny.</strong>{" "}
                  Cars from Spain, Italy, and southern France benefit from less
                  salt corrosion but often suffer from sun damage to interiors,
                  rubber components, and paint. The assumption that
                  &ldquo;southern car = rust-free&rdquo; is not always reliable
                  -- coastal environments in Italy and Spain can be surprisingly
                  harsh on unprotected steel.
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
                  A complete guide to budgets, inspections, and common mistakes
                </p>
              </div>
              <ArrowRight className="size-5 shrink-0 text-stone-400 group-hover:text-amber-600 transition-colors" />
            </Link>
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
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Act on Your Insights
          </h2>
          <p className="mt-4 text-stone-400">
            Browse our curated collection of classic and beautiful cars, or
            list your own to reach serious buyers across Europe.
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
