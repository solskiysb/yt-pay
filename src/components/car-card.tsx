import Image from "next/image";
import Link from "next/link";
import { MapPin, Gauge, Gavel } from "lucide-react";
import { SaveButton } from "@/components/save-button";
import { AuctionCountdown } from "@/components/auction-panel";
import type { Car } from "@/lib/types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    price
  );

const conditionConfig = {
  excellent: { label: "Excellent", className: "bg-emerald-100 text-emerald-800" },
  good: { label: "Good", className: "bg-blue-100 text-blue-800" },
  fair: { label: "Fair", className: "bg-amber-100 text-amber-800" },
} as const;

export function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const condition = conditionConfig[car.condition];
  const isAboveFold = index < 6;
  const isAuction = car.listingType === "auction";

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group block overflow-hidden rounded-xl bg-white ring-1 ring-stone-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:ring-stone-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <Image
          src={car.images[0]}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={isAboveFold}
          loading={isAboveFold ? "eager" : "lazy"}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {isAuction && (
            <span className="flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
              <Gavel className="size-3" />
              Auction
            </span>
          )}
          {car.status === "sold" && (
            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
              Sold
            </span>
          )}
          {car.featured && car.status !== "sold" && !isAuction && (
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
              Featured
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${condition.className}`}
          >
            {condition.label}
          </span>
        </div>
        {car.dbId && (
          <div className="absolute top-3 right-3 z-10">
            <SaveButton listingId={car.dbId} />
          </div>
        )}
        {car.status === "sold" && (
          <div className="absolute inset-0 bg-stone-900/20" />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-stone-900 tracking-tight">
          {car.year} {car.make} {car.model}
        </h3>

        {isAuction ? (
          <div className="mt-1">
            <p className="text-xl font-bold text-stone-900">
              {(car.currentBid ?? 0) > 0
                ? formatPrice(car.currentBid!)
                : formatPrice(car.startingBid ?? car.price)}
            </p>
            <div className="mt-1.5 flex items-center gap-3 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <Gavel className="size-3.5" />
                {car.bidCount ?? 0} {(car.bidCount ?? 0) === 1 ? "bid" : "bids"}
              </span>
              {car.auctionEnd && (
                <AuctionCountdown auctionEnd={car.auctionEnd} />
              )}
            </div>
          </div>
        ) : (
          <p className="mt-1 text-xl font-bold text-stone-900">
            {formatPrice(car.price)}
          </p>
        )}

        <div className="mt-3 flex items-center gap-4 text-sm text-stone-500">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {car.location}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="size-3.5" />
            {car.mileage.toLocaleString("de-DE")} km
          </span>
        </div>
      </div>
    </Link>
  );
}
