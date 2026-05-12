import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  MapPin,
  Gauge,
  Check,
  User,
} from "lucide-react";
import { getListingBySlug } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { PhotoGallery } from "@/components/photo-gallery";
import { InquiryForm } from "@/components/inquiry-form";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    price
  );

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
    return { title: "Car Not Found | YT Pay" };
  }
  return {
    title: `${car.year} ${car.make} ${car.model} | YT Pay`,
    description: car.shortDescription,
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

  const condition = conditionConfig[car.condition];

  const specRows = [
    { label: "Engine", value: car.specs.engine },
    { label: "Transmission", value: car.specs.transmission },
    { label: "Drivetrain", value: car.specs.drivetrain },
    { label: "Exterior Color", value: car.specs.exteriorColor },
    { label: "Interior Color", value: car.specs.interiorColor },
    { label: "Body Type", value: car.specs.bodyType },
    { label: "Mileage", value: `${car.mileage.toLocaleString("de-DE")} km` },
    { label: "Year", value: String(car.year) },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/cars"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
      >
        <ArrowLeft className="size-4" />
        Back to Browse
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Left: Photos */}
        <div className="lg:col-span-3">
          <PhotoGallery
            images={car.images}
            alt={`${car.year} ${car.make} ${car.model}`}
          />
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${condition.className}`}
            >
              {condition.label}
            </span>
            {car.featured && (
              <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900">
            {car.year} {car.make} {car.model}
          </h1>

          <p className="mt-2 text-3xl font-bold text-stone-900">
            {formatPrice(car.price)}
          </p>

          <div className="mt-4 flex items-center gap-5 text-sm text-stone-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {car.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="size-4" />
              {car.mileage.toLocaleString("de-DE")} km
            </span>
          </div>

          <Separator className="my-6" />

          <p className="text-stone-600 leading-relaxed">{car.description}</p>

          <Separator className="my-6" />

          {/* Specs Table */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-stone-900">
              Specifications
            </h2>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {specRows.map((spec) => (
                <div key={spec.label}>
                  <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                    {spec.label}
                  </span>
                  <p className="text-sm font-medium text-stone-700">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Features */}
          {car.features.length > 0 && (
            <>
              <div>
                <h2 className="mb-3 text-lg font-semibold text-stone-900">
                  Features
                </h2>
                <ul className="grid grid-cols-2 gap-2">
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

              <Separator className="my-6" />
            </>
          )}

          {/* Seller Contact */}
          <div className="rounded-xl bg-stone-50 p-5">
            <h2 className="mb-3 text-lg font-semibold text-stone-900">
              Contact Seller
            </h2>
            <p className="mb-4 flex items-center gap-2 text-sm text-stone-700">
              <User className="size-4 text-stone-400" />
              {car.sellerName}
            </p>

            <InquiryForm
              listingId={car.dbId}
              sellerId={car.sellerId}
              listingTitle={`${car.year} ${car.make} ${car.model}`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
