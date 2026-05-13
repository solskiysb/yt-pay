"use client";

import { Gavel } from "lucide-react";
import { AuctionCountdown } from "@/components/auction-panel";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

interface MobileStickyAuctionProps {
  currentBid: number;
  auctionEnd: string;
}

export function MobileStickyAuction({
  currentBid,
  auctionEnd,
}: MobileStickyAuctionProps) {
  function scrollToForm() {
    const el = document.getElementById("inquiry-form-mobile");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-stone-900">
            {currentBid > 0 ? formatPrice(currentBid) : "No bids yet"}
          </p>
          <AuctionCountdown auctionEnd={auctionEnd} />
        </div>
        <button
          onClick={scrollToForm}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:bg-blue-700"
        >
          <Gavel className="size-4" />
          Place Bid
        </button>
      </div>
    </div>
  );
}
