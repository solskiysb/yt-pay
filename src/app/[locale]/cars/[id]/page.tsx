import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin,
  Gauge,
  Check,
  User,
  Calendar,
  Eye,
  Hash,
  Shield,
  MessageCircle,
  BadgeCheck,
  ChevronRight,
  Gavel,
} from "lucide-react";
import { getListingBySlug, getBidsForListing } from "@/lib/db";
import { PhotoGallery } from "@/components/photo-gallery";
import { InquiryForm } from "@/components/inquiry-form";
import { AuctionPanel } from "@/components/auction-panel";
import { ShareButtons } from "@/components/share-buttons";
import { ViewTracker } from "@/components/view-tracker";
import { MobileStickyInquiry } from "@/components/mobile-sticky-inquiry";
import { MobileStickyAuction } from "@/components/mobile-sticky-auction";
import { siteConfig } from "@/lib/config";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

const conditionConfig = {
  excellent: {
    label: "Excellent",
    className: "bg-emerald-100 text-emerald-800",
  },
  good: { label: "Good", className: "bg-blue-100 text-blue-800" },
  fair: { label: "Fair", className: "bg-amber-100 text-amber-800" },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await getListingBySlug(id);
  if (!car) {
    return { title: "Car Not Found | EraMarque" };
  }

  // Noindex demo listings: images from wikimedia/placeholder = seeded demo data
  const isDemoListing = car.images.some(
    (img) =>
      img.includes("wikimedia.org") ||
      img.includes("wikipedia.org") ||
      img.includes("placehold.co")
  );

  return {
    title: `${car.year} ${car.make} ${car.model} | EraMarque`,
    description: car.shortDescription,
    ...(isDemoListing && {
      robots: { index: false, follow: true },
    }),
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getListingBySlug(id);

  if (!car) {
    notFound();
  }

  const isAuction = car.listingType === "auction";

  // Fetch bids for auction listings
  const bids = isAuction ? await getBidsForListing(car.dbId) : [];

  const condition = conditionConfig[car.condition];

  const specRows = [
    { label: "Engine", value: car.specs.engine },
    { label: "Transmission", value: car.specs.transmission },
    { label: "Drivetrain", value: car.specs.drivetrain },
    { label: "Body Type", value: car.specs.bodyType },
    { label: "Exterior Color", value: car.specs.exteriorColor },
    { label: "Interior Color", value: car.specs.interiorColor },
    { label: "Mileage", value: `${car.mileage.toLocaleString("de-DE")} km` },
    { label: "Condition", value: condition.label },
    { label: "Year", value: String(car.year) },
  ];

  const listedDate = new Date(car.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Schema.org structured data
  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${car.year} ${car.make} ${car.model}`,
    brand: { "@type": "Brand", name: car.make },
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    color: car.specs.exteriorColor,
    vehicleTransmission: car.specs.transmission,
    driveWheelConfiguration: car.specs.drivetrain,
    vehicleEngine: {
      "@type": "EngineSpecification",
      name: car.specs.engine,
    },
    itemCondition:
      car.condition === "excellent"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "EUR",
      availability:
        car.status === "sold"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "EraMarque" },
      url: `${siteConfig.url}/cars/${car.id}`,
    },
    image: car.images,
    description: car.description,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Cars",
        item: `${siteConfig.url}/cars`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: car.make,
        item: `${siteConfig.url}/cars?make=${car.make}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${car.year} ${car.make} ${car.model}`,
      },
    ],
  };

  return (
    <main className="pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(vehicleJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <ViewTracker slug={id} />

      {/* Full-width Photo Gallery */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-stone-400">
          <Link
            href="/cars"
            className="transition-colors hover:text-stone-700"
          >
            Cars
          </Link>
          <ChevronRight className="size-3.5" />
          <Link
            href={`/cars?make=${encodeURIComponent(car.make)}`}
            className="transition-colors hover:text-stone-700"
          >
            {car.make}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-stone-600">{car.model}</span>
        </nav>

        <PhotoGallery
          images={car.images}
          alt={`${car.year} ${car.make} ${car.model}`}
        />
      </div>

      {/* Two-column layout */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left column: Details */}
          <div className="lg:col-span-2">
            {/* Title and badges */}
            <div className="flex flex-wrap items-center gap-2">
              {isAuction && (
                <span className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  <Gavel className="size-3" />
                  Auction
                </span>
              )}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${condition.className}`}
              >
                {condition.label}
              </span>
              {car.featured && (
                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                  Featured
                </span>
              )}
              {car.status === "sold" && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                  Sold
                </span>
              )}
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              {car.year} {car.make} {car.model}
            </h1>

            {!isAuction && (
              <p className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl">
                {formatPrice(car.price)}
              </p>
            )}

            {/* Location, mileage, condition inline */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-stone-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {car.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Gauge className="size-4" />
                {car.mileage.toLocaleString("de-DE")} km
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {car.year}
              </span>
            </div>

            {/* Share buttons */}
            <div className="mt-5">
              <ShareButtons
                url={`${siteConfig.url}/cars/${id}`}
                title={`${car.year} ${car.make} ${car.model}`}
              />
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-stone-200 pt-8">
              <h2 className="text-lg font-semibold text-stone-900">
                Description
              </h2>
              <p className="mt-3 whitespace-pre-line text-stone-600 leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="mt-8 border-t border-stone-200 pt-8">
              <h2 className="text-lg font-semibold text-stone-900">
                Specifications
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {specRows.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-xl bg-stone-50 px-4 py-3"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                      {spec.label}
                    </span>
                    <p className="mt-0.5 text-sm font-semibold text-stone-800">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {car.features.length > 0 && (
              <div className="mt-8 border-t border-stone-200 pt-8">
                <h2 className="text-lg font-semibold text-stone-900">
                  Features
                </h2>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                  {car.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-stone-600"
                    >
                      <Check className="size-4 flex-shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Listing Details */}
            <div className="mt-8 border-t border-stone-200 pt-8">
              <h2 className="text-lg font-semibold text-stone-900">
                Listing Details
              </h2>
              <div className="mt-4 flex flex-wrap gap-6 text-sm text-stone-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-4 text-stone-400" />
                  Listed {listedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="size-4 text-stone-400" />
                  Views tracked
                </span>
                <span className="flex items-center gap-1.5">
                  <Hash className="size-4 text-stone-400" />
                  ID: {car.id}
                </span>
              </div>
            </div>
          </div>

          {/* Right column: Sticky sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                {isAuction ? (
                  <>
                    <AuctionPanel
                      listingId={car.dbId}
                      initialCurrentBid={car.currentBid ?? 0}
                      initialBidCount={car.bidCount ?? 0}
                      initialReserveMet={car.reserveMet ?? false}
                      auctionEnd={car.auctionEnd!}
                      startingBid={car.startingBid ?? 0}
                      reservePrice={car.reservePrice}
                      initialBids={bids}
                    />

                    {/* Seller info */}
                    <div className="mt-5 border-t border-stone-100 pt-5">
                      <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-stone-200 text-stone-500">
                          <User className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-800">
                            {car.sellerName}
                          </p>
                          <p className="text-xs text-stone-400">
                            Member since{" "}
                            {new Date(car.createdAt).getFullYear()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Price */}
                    <p className="text-3xl font-bold text-stone-900">
                      {formatPrice(car.price)}
                    </p>

                    {/* Seller info */}
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-stone-200 text-stone-500">
                        <User className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {car.sellerName}
                        </p>
                        <p className="text-xs text-stone-400">
                          Member since{" "}
                          {new Date(car.createdAt).getFullYear()}
                        </p>
                      </div>
                    </div>

                    {/* Inquiry form */}
                    <div id="inquiry-form" className="mt-6">
                      <InquiryForm
                        listingId={car.dbId}
                        sellerId={car.sellerId}
                        listingTitle={`${car.year} ${car.make} ${car.model}`}
                      />
                    </div>

                    {/* Disclaimer */}
                    <p className="mt-5 text-center text-xs leading-relaxed text-stone-400">
                      This is a classified ad. {siteConfig.name} is not involved
                      in any transactions between buyers and sellers.
                    </p>
                  </>
                )}

                {/* Trust badges */}
                <div className="mt-5 border-t border-stone-100 pt-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 text-sm text-stone-500">
                      <BadgeCheck className="size-4 flex-shrink-0 text-emerald-500" />
                      <span>Verified Platform</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-stone-500">
                      <Shield className="size-4 flex-shrink-0 text-emerald-500" />
                      <span>{isAuction ? "Secure Bidding" : "Secure Messaging"}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-stone-500">
                      <MessageCircle className="size-4 flex-shrink-0 text-emerald-500" />
                      <span>No Hidden Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile section (shown inline on mobile, hidden on desktop) */}
          <div id="inquiry-form-mobile" className="lg:hidden">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              {isAuction ? (
                <>
                  <AuctionPanel
                    listingId={car.dbId}
                    initialCurrentBid={car.currentBid ?? 0}
                    initialBidCount={car.bidCount ?? 0}
                    initialReserveMet={car.reserveMet ?? false}
                    auctionEnd={car.auctionEnd!}
                    startingBid={car.startingBid ?? 0}
                    reservePrice={car.reservePrice}
                    initialBids={bids}
                  />

                  <div className="mt-5 border-t border-stone-100 pt-5">
                    <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-stone-200 text-stone-500">
                        <User className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {car.sellerName}
                        </p>
                        <p className="text-xs text-stone-400">
                          Member since{" "}
                          {new Date(car.createdAt).getFullYear()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Seller info */}
                  <div className="mb-5 flex items-center gap-3 rounded-xl bg-stone-50 p-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-stone-200 text-stone-500">
                      <User className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">
                        {car.sellerName}
                      </p>
                      <p className="text-xs text-stone-400">
                        Member since{" "}
                        {new Date(car.createdAt).getFullYear()}
                      </p>
                    </div>
                  </div>

                  <InquiryForm
                    listingId={car.dbId}
                    sellerId={car.sellerId}
                    listingTitle={`${car.year} ${car.make} ${car.model}`}
                  />

                  <p className="mt-5 text-center text-xs leading-relaxed text-stone-400">
                    This is a classified ad. {siteConfig.name} is not involved in
                    any transactions between buyers and sellers.
                  </p>
                </>
              )}

              {/* Trust badges */}
              <div className="mt-5 flex flex-wrap justify-center gap-4 border-t border-stone-100 pt-5 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="size-3.5 text-emerald-500" />
                  Verified Platform
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="size-3.5 text-emerald-500" />
                  {isAuction ? "Secure Bidding" : "Secure Messaging"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5 text-emerald-500" />
                  No Hidden Fees
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      {isAuction ? (
        <MobileStickyAuction
          currentBid={car.currentBid ?? 0}
          auctionEnd={car.auctionEnd!}
        />
      ) : (
        <MobileStickyInquiry price={formatPrice(car.price)} />
      )}
    </main>
  );
}
